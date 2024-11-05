[⬅️ [TORNA ALL'INDICE] ](../README.md)

## Vulnerabilità di Sicurezza

### Cross-Site Scripting (XSS)
XSS è una vulnerabilità che permette di eseguire un attacco iniettando codice JavaScript maligno nel tuo sito web. Questo codice viene eseguito nel browser che visita il sito.

Ecco un esempio di codice PHP vulnerabile, dove il parametro 'name' viene restituito direttamente senza sanificazione, cioè senza ripulirlo dai tag html che potrebbero consentire l'esecuzione di codice javascript.

Supponiamo di avere una pagina welcome.php scritta in questo modo:
```php
<?php
echo "Benvenuto, " . $_GET['name'];
?>
```
Una pagina di questo tipo risponde ad una richiesta del tipo
`http://tuosito.com/welcome.php?name=Paul`
con una pagina html:
```html
Benvenuto, Paul
```

Ma che succede se inviamo un richiesta di questo tipo?
`http://tuosito.com/welcome.php?name=<script>document.cookie</script>`

La pagina restituita diventa:
```html
Benvenuto, <script>document.cookie</script>
```
forzando il server a generare una pagina di risposta con del codice javascript arbitrario.

Per prevenire un attacco del genere, sul server va utilizzato htmlspecialchars():

```php
<?php
echo "Benvenuto, " . htmlspecialchars($_GET['name']);
?>
```

La funzione `htmlspecialchars()` converte i caratteri speciali HTML in entità HTML. Per esempio:
- `<` diventa `&lt;`
- `>` diventa `&gt;`

Questo impedisce l'esecuzione di codice JavaScript maligno, perché il browser interpreterà i caratteri speciali come testo da visualizzare e non come codice da eseguire. Nell'esempio precedente, l'output sanificato sarebbe:
`Benvenuto, &lt;script&gt;document.cookie&lt;/script&gt;`

I cookie sono particolarmente vulnerabili agli attacchi XSS perché JavaScript può accedere ai cookie della pagina corrente attraverso l'oggetto `document.cookie`.

Oltre all'uso di htmlspecialchars, per proteggere i cookie da questo tipo di attacco, è necessario utilizzare le appropriate flag di sicurezza:

```php
<?php
setcookie("session_id", "123456", [
    'httponly' => true,    // Previene l'accesso via JavaScript
    'secure' => true,      // Solo HTTPS
    'samesite' => 'Strict' // Previene CSRF
]);
?>
```

Spiegazione delle flag di sicurezza:
- `httponly`: Impedisce a JavaScript di accedere al cookie. Il cookie sarà disponibile solo per il server.
- `secure`: Il cookie viene inviato solo su connessioni HTTPS cifrate.
- `samesite Strict`: Il cookie viene inviato solo se si è sullo stesso sito
  

### Cross-Site Request Forgery (CSRF)
CSRF è un attacco che forza un utente autenticato a eseguire azioni indesiderate su un sito web dove è già autenticato. L'attacco sfrutta il fatto che il browser invia automaticamente i cookie (incluso il cookie di sessione) con ogni richiesta al sito.

#### Come Funziona un Attacco CSRF:
1. L'utente fa login su un sito (es. la sua banca)
2. Il browser memorizza il cookie di sessione
3. L'utente, mentre è ancora loggato alla banca, visita un sito maligno
4. Il sito maligno fa partire automaticamente una richiesta alla banca
5. Il browser invia automaticamente il cookie di sessione con la richiesta
6. La banca riconosce il cookie valido ed esegue l'operazione

#### Esempio di Vulnerabilità CSRF

Ecco una pagina vulnerabile di trasferimento denaro sul sito della banca.
Supponiamo di avere una pagina php `transfer.php` che richiama una funzione transferMoney per il trasferimento bancario.

```php
<?php
    transferMoney($_POST['to'], $_POST['amount']);
?>
```

Si potrebbe creare una pagina maligna che sfrutta questa vulnerabilità:

```html
<html>
<body onload="document.forms[0].submit()">
    <form action="http://banca.com/transfer.php" method="POST">
        <input type="hidden" name="amount" value="1000">
        <input type="hidden" name="to" value="cyber_criminal">
    </form>
</body>
</html>
```

Quando la vittima visita questa pagina maligna, mentre è ancora collegato al sito della banca:
- Il form viene inviato automaticamente, contattando il sito della banca
- Il browser include automaticamente i cookie legittimi della banca
- La banca vede una richiesta apparentemente legittima
- Il trasferimento viene eseguito senza che l'utente se ne accorga


#### Protezione da CSRF

La protezione CSRF si basa sul principio che il sito maligno non può leggere il contenuto delle risposte dal sito legittimo. Ecco come implementare una protezione:

Per prima cosa, generiamo un token CSRF univoco:

```php
<?php
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
```

La generazione del token CSRF usa due funzioni:
1. `random_bytes(32)`: Genera 32 byte di dati casuali
2. `bin2hex()`: Converte i byte binari in una stringa esadecimale leggibile

Esempio di token generato:
```php
"7f13c8e5b2d9a4f6c3d8e1f5a2b7c4d9e6f3a8b5c2d7e4f1a9b6c3d8e5f2a7"
```

Poi includiamo il token, in modo dinamico, **in ogni form del nostro sito**:

```php
<form method="POST" action="/transfer.php">
    <input type="hidden" name="csrf_token" 
           value="<?php echo $_SESSION['csrf_token']; ?>">
    <input type="text" name="amount">
    <input type="text" name="to">
    <button type="submit">Trasferisci</button>
</form>
```
In modo che sul client ci sia un form con il campo "csrf_token" impostato dal server:
```html
<form method="POST" action="/transfer.php">
    <input type="hidden" name="csrf_token" value="7f13c8e5b2">
    <input type="text" name="amount">
    <input type="text" name="to">
    <button type="submit">Trasferisci</button>
</form>
```


Infine, sul server, in ogni richiesta POST verifichiamo che il token inviato con il form sia lo stesso generato ad inizio sessione:

```php
if ( $_SESSION['csrf_token'] != $_POST['csrf_token'] ) {
    die('CSRF token non valido');
}
```

Questo funziona perché:
1. Il token cambia ad ogni sessione
2. Il sito maligno non può conoscere il token generato sul server
3. Senza il token corretto, la richiesta viene rifiutata


[⬅️ [TORNA ALL'INDICE] ](../README.md)