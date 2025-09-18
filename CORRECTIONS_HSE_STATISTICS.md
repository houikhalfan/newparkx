# Corrections des Calculs HSE Statistics

## Résumé des Corrections Apportées

Les calculs des statistiques HSE ont été corrigés selon les formules fournies dans le modèle `app/Models/HseStat.php`.

### 1. TRIR (Total Recordable Incident Rate)
**Formule corrigée :** `(Nombre total des accidents enregistrables / Nombre total des heures travaillées) * 200000`

**Accidents enregistrables inclus :**
- Accidents mortels (`acc_mortel`)
- Accidents avec arrêt (`acc_arret`) 
- Accidents avec soins médicaux (`acc_soins_medicaux`)
- Accidents avec restriction temporaire (`acc_restriction_temporaire`)

### 2. LTIR (Lost Time Injury Rate)
**Formule corrigée :** `(Nombre des accidents avec arrêt / Nombre total des heures travaillées) * 200000`

**Accidents avec arrêt inclus :**
- Accidents mortels (`acc_mortel`)
- Accidents avec arrêt (`acc_arret`)

### 3. DART (Days Away, Restricted or Transferred Rate)
**Formule corrigée :** `(Nbre de DART × 200 000) / Heures travaillées`

**DART inclus :**
- Accidents mortels (`acc_mortel`)
- Accidents avec restriction temporaire (`acc_restriction_temporaire`)

### 4. Volume Horaire Travaillé
**Formule :** `Volume horaire normale + Volume horaire supplémentaire`

### 5. Moyenne des Personnes Sensibilisées
**Formule corrigée :** `(Total des personnes sensibilisées / effectif du personnel) * 100`

### 6. Total des Permis
**Formule :** `Nombre des permis général + Nombre des permis spécifiques`

### 7. Pourcentage PTSR Contrôlé
**Formule :** `(Nombre PTSR Contrôlé / Nombre PTSR) * 100`

### 8. Formations et Inductions
**Formules corrigées :**

- **Total des personnes formées/induction HSE :** `Total des inductions + Total des personnes formés`
- **Total des heures de formations et induction :** `Volume horaire des inductions + Total des heures de formations`

### 9. Inspections HSE
**Formule :** `Total des inspections ci-dessous`

## Fichiers Modifiés

- `app/Models/HseStat.php` : Corrections des calculs automatiques dans la méthode `boot()`

## Impact

Ces corrections garantissent que tous les calculs de statistiques HSE sont conformes aux formules standard de l'industrie et aux exigences métier spécifiées.

Les calculs sont automatiquement effectués lors de la sauvegarde des données HSE, garantissant la cohérence des résultats.
