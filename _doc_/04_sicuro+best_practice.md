[⬅️ [TORNA ALL'INDICE] ](../README.md)

### Implementazione Sicura di una Sessione
```php
<?php
// Configurazione sicura della sessione
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_only_cookies', 1);

// Rigenerazione ID sessione dopo login
session_start();
if ($login_success) {
    session_regenerate_id(true);
    $_SESSION['user_id'] = $user_id;
    $_SESSION['last_activity'] = time();
}

// Verifica timeout sessione
if (isset($_SESSION['last_activity']) && 
    (time() - $_SESSION['last_activity'] > 1800)) {
    session_unset();
    session_destroy();
    header('Location: login.php');
    exit();
}
```

### Buone pratiche di Sicurezza

1. **Prevenzione XSS**
   - Sanitizza sempre l'output con `htmlspecialchars()`
   - Usa Content Security Policy (CSP)
   - Imposta il flag HttpOnly sui cookie
   - Valida e sanitizza tutti gli input

2. **Prevenzione CSRF**
   - Implementa token CSRF per ogni form
   - Usa SameSite=Strict nei cookie
   - Verifica l'header Origin/Referer
   - Implementa timeout di sessione

3. **Gestione Sessioni**
   - Rigenera l'ID sessione dopo il login
   - Implementa timeout di sessione
   - Usa HTTPS
   - Memorizza il minimo indispensabile nella sessione

## Best Practices

1. **Sicurezza**
   - Usa HTTPS per proteggere i cookie
   - Imposta flag HttpOnly per prevenire XSS
   - Usa token CSRF per le sessioni

2. **Performance**
   - Limita la dimensione dei dati di sessione
   - Pulisci regolarmente le sessioni scadute
   - Usa cookie solo quando necessario

3. **Usabilità**
   - Fornisci alternative se i cookie sono disabilitati
   - Implementa un sistema di gestione del consenso per i cookie
   - Mantieni la sessione attiva solo per il tempo necessario


[⬅️ [TORNA ALL'INDICE] ](../README.md)