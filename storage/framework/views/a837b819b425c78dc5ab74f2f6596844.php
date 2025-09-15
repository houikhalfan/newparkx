
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>VOD #<?php echo e($vod->id); ?></title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 10pt; color:#000; line-height:1.4; }

    .muted { color:#000; font-style: italic; font-size: 8pt; }

    .box {
      border:1px solid #000;
      padding:10px;
      margin-bottom:12px;
      page-break-inside: avoid; /* keep corrective action intact */
    }

    ul { margin:0; padding-left:16px; font-size: 9pt; }

    table { width:100%; border-collapse: collapse; page-break-inside: avoid; }
    th, td { border:1px solid #000; padding:6px; text-align:left; vertical-align: top; font-size:9pt; }

    /* Images */
    img { border:1px solid #000; }
    .photo-wide {
      display: block;
      max-width: 100%;
      width: 100%;          /* consistent width */
      height: auto;
      max-height: 280px;    /* medium size */
      margin: 6px 0;
      object-fit: contain;
      border:1px solid #000;
    }

    /* --- Top bar --- */
    .topbar { width:100%; border:2px solid #000; margin-bottom:10px; }
    .topbar td { border:1px solid #000; padding:10px 12px; vertical-align:middle; }
    .topbar .logo  { width:22%; }
    .topbar .title { width:56%; text-align:center; font-weight:bold; font-size:18pt; }
    .topbar .meta  { width:22%; text-align:right; font-size:9pt; line-height:1.4; }

    .title-main { font-size:18pt; font-weight:bold; }
    .top-divider { height:2px; background:#000; margin:6px 0 18px; border:none; }

    /* Section bars */
    .section-bar {
      background:#000;
      color:#fff;
      text-align:center;
      font-weight:bold;
      padding:6px 10px;
      margin:22px 0 10px;
      font-size:11pt;
      page-break-inside: avoid;
    }
    .section-bar small { font-weight:normal; font-style:italic; font-size:8pt; }

    /* Info grid widths */
    .info-grid td { border:1px solid #000; padding:8px 10px; font-size:9pt; }
    .w-33 { width:33.33%; }

    /* Horizontal list tables */
    .hlist th, .hlist td {
      border:1px solid #000;
      padding:6px;
      vertical-align:top;
      font-size:9pt;
      page-break-inside: avoid;
    }
    .hlist .label { width:160px; background:#f5f5f5; font-weight:bold; }
    .hlist .spacer { border:none; }
  </style>
</head>
<body>
<?php
    // Date d’émission (création du VOD) ou aujourd’hui
    $emission = $vod->created_at
        ? \Carbon\Carbon::parse($vod->created_at)->format('d/m/Y')
        : now()->format('d/m/Y');

    // Date de la visite
    $dateVisite = '—';
    $d = $vod->getAttribute('date');
    if ($d instanceof \Carbon\CarbonInterface) {
        $dateVisite = $d->format('d/m/Y');
    } elseif (!empty($d)) {
        try { $dateVisite = \Carbon\Carbon::parse($d)->format('d/m/Y'); }
        catch (\Throwable $e) { $dateVisite = (string)$d; }
    }
?>

<!-- Bandeau top -->
<table class="topbar">
  <tr>
    <td class="logo">
      <img src="<?php echo e(public_path('images/logo.png')); ?>" alt="Logo" style="max-height:50px; border:none;">
    </td>
    <td class="title">
      <div class="title-main">Formulaire</div>
      <div>« Visites Observation et ronde HSE »</div>
    </td>
    <td class="meta">
      <div>Date d’émission<br><strong><?php echo e($emission); ?></strong></div>
    </td>
  </tr>
</table>

<hr class="top-divider">

<!-- Informations -->
<div class="section-bar">Informations</div>
<table class="info-grid">
  <tr>
    <td class="w-33"><strong>Date :</strong> <?php echo e($dateVisite); ?></td>
<td class="w-33">
  <strong>Projet :</strong>
  <?php echo e($vod->project->name ?? '—'); ?>

</td>
    <td class="w-33"><strong>Activité :</strong> <?php echo e($vod->activite); ?></td>
  </tr>
  <tr>
    <td class="w-33"><strong>Observateur :</strong> <?php echo e($vod->observateur); ?></td>
    <td class="w-33">
      <strong>Personnes observées :</strong><br>
      <div class="muted">
        <?php $__currentLoopData = $vod->personnes_observees ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $p): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          • <?php echo e($p); ?><br>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      </div>
    </td>
    <td class="w-33">
      <strong>Entreprise observée :</strong><br>
      <div class="muted">
        <?php $__currentLoopData = $vod->entreprise_observee ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $e): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          • <?php echo e($e); ?><br>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      </div>
    </td>
  </tr>
</table>

<!-- Bonnes pratiques -->
<div class="section-bar">Bonnes pratiques</div>
<?php if(!empty($vod->pratiques)): ?>
  <table class="hlist">
    <tbody>
      <?php $__currentLoopData = $vod->pratiques; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $p): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <tr>
          <td class="label">Description</td>
          <td><?php echo e($p['text'] ?? ''); ?></td>
        </tr>
        <?php if(!empty($p['photo'])): ?>
          <tr>
            <td colspan="2">
              <img class="photo-wide" src="<?php echo e(public_path('storage/' . $p['photo'])); ?>" alt="">
            </td>
          </tr>
        <?php endif; ?>
        <?php if(!$loop->last): ?>
          <tr><td class="spacer" colspan="2" style="padding:4px 0;"></td></tr>
        <?php endif; ?>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
  </table>
<?php else: ?>
  <div class="muted">Aucune.</div>
<?php endif; ?>

<!-- Comportements dangereux -->
<div class="section-bar">Comportements dangereux</div>
<?php if(!empty($vod->comportements)): ?>
  <table class="hlist">
    <tbody>
      <?php $__currentLoopData = $vod->comportements; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $c): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <tr>
          <td class="label">Type</td>
          <td><?php echo e($c['type'] ?? ''); ?></td>
        </tr>
        <tr>
          <td class="label">Description</td>
          <td><?php echo e($c['description'] ?? ''); ?></td>
        </tr>
        <?php if(!empty($c['photo'])): ?>
          <tr>
            <td colspan="2">
              <img class="photo-wide" src="<?php echo e(public_path('storage/' . $c['photo'])); ?>" alt="">
            </td>
          </tr>
        <?php endif; ?>
        <?php if(!$loop->last): ?>
          <tr><td class="spacer" colspan="2" style="padding:4px 0;"></td></tr>
        <?php endif; ?>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
  </table>
<?php else: ?>
  <div class="muted">Aucun.</div>
<?php endif; ?>

<!-- Conditions dangereuses -->
<div class="section-bar">
  Conditions dangereuses
  <br><small>Cocher en cas de détection d'une ou plusieurs anomalies.</small>
</div>
<?php $conds = $vod->conditions ?? []; ?>
<?php if(!empty($conds)): ?>
  <ul>
    <?php $__currentLoopData = $conds; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $v): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <?php if($v): ?> <li><?php echo e($k); ?></li> <?php endif; ?>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </ul>
<?php else: ?>
  <div class="muted">Aucune.</div>
<?php endif; ?>

<!-- Actions correctives -->
<div class="section-bar">Actions correctives</div>
<?php $corr = $vod->correctives ?? []; ?>
<?php if(!empty($corr)): ?>
  <?php $__currentLoopData = $corr; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $fields): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <div class="box">
      <strong><?php echo e($k); ?></strong><br>
      <?php if(!empty($fields['action'])): ?> Action : <?php echo e($fields['action']); ?><br><?php endif; ?>
      <?php if(!empty($fields['responsable'])): ?> Responsable : <?php echo e($fields['responsable']); ?><br><?php endif; ?>
      <?php if(!empty($fields['statut'])): ?> Statut : <?php echo e($fields['statut']); ?><br><?php endif; ?>
      <?php if(!empty($fields['photo'])): ?>
        <img src="<?php echo e(public_path('storage/' . $fields['photo'])); ?>" class="photo-wide">
      <?php endif; ?>
    </div>
  <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php else: ?>
  <div class="muted">Aucune.</div>
<?php endif; ?>

</body>
</html>
<?php /**PATH C:\Users\ADMIN\Pictures\newparkx\resources\views/vods/pdf.blade.php ENDPATH**/ ?>