#!/bin/sh
php import_stages.php
php import_steps.php
php import_touchpoints.php
cp icon.png ../launchers/pathpoint-launcher
cp logo.png ../nerdlets/pathpoint-nerdlet/images