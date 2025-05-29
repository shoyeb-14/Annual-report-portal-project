<?php
$newPassword = 'hod_cse456'; // Choose your new password
$hash = password_hash($newPassword, PASSWORD_BCRYPT);
echo $hash;
?>