# Correction du Filtre de Date - Statistiques Agrégées Admin

## Problème Identifié

Dans les statistiques agrégées admin, la recherche par date utilisait le champ `created_at` (date de création/soumission) au lieu du champ `date` (date de la période des statistiques HSE de la section "Période & Heures").

## Corrections Apportées

### Fichier Modifié : `app/Http/Controllers/Admin/StatisticsController.php`

#### 1. Méthode `aggregated()` (lignes 47-53)
**Avant :**
```php
$query->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
```

**Après :**
```php
$query->whereBetween('date', [$startDate, $endDate]);
```

#### 2. Méthode `exportExcel()` (lignes 469-475)
**Avant :**
```php
$query->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
```

**Après :**
```php
$query->whereBetween('date', [$startDate, $endDate]);
```

#### 3. Ordre de Tri dans `aggregated()` (ligne 67)
**Avant :**
```php
$allStats = $query->orderBy('created_at', 'desc')->get();
```

**Après :**
```php
$allStats = $query->orderBy('date', 'desc')->get();
```

## Impact

- ✅ La recherche par date début/fin utilise maintenant la date de la période des statistiques HSE
- ✅ Les résultats sont triés par date de période (plus récente en premier)
- ✅ Cohérence avec les données affichées dans les statistiques
- ✅ Les exports Excel respectent aussi le filtre sur la date de période

## Champ Utilisé

Le filtre utilise maintenant le champ `date` qui correspond à la date saisie dans la section "Période & Heures" du formulaire HSE Statistics, et non plus `created_at` (date de soumission du formulaire).
