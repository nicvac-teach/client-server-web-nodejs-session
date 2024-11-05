[⬅️ [TORNA ALL'INDICE] ](../README.md)

## Esempi Pratici

### Esempio di Gestione Sessione
In una pagina vengono impostate la variabili di sessione.
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

In un'altra pagina, usando le varibili di sessione impostate precedentemente, si verifica se l'utente è loggato:

```php
session_start();
if (!isset($_SESSION['logged_in'])) {
    echo "Devi effettuare il login";
} else {
    echo "Benvenuto " . $_SESSION['username'];
}
```

### Esempio di Gestione Cookie
Impostiamo una preferenza utente.
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



[⬅️ [TORNA ALL'INDICE] ](../README.md)