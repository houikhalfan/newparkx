<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Permis de travail sécuritaire</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 8pt;
      line-height: 1.2;
      color: #000;
      margin: 0;
      padding: 0;
    }

    .page {
      border: 2px solid #000;
      padding: 6px;
      margin-bottom: 8px;
      page-break-after: always;
    }

    .page:last-child {
      page-break-after: auto;
    }

    .hdr {
      display: table;
      width: 100%;
      border: 2px solid #000;
      margin-bottom: 4px;
    }

    .hdr .logo {
      display: table-cell;
      width: 60px;
      text-align: center;
      vertical-align: middle;
      padding: 2px;
    }

    .hdr .title {
      display: table-cell;
      text-align: center;
      font-weight: bold;
      font-size: 14pt;
      vertical-align: middle;
    }

    .hdr .nums {
      display: table;
      width: 100%;
      border-top: 1px solid #000;
    }

    .hdr .nums div {
      display: table-cell;
      padding: 3px 4px;
      border-left: 1px solid #000;
      font-size: 7pt;
    }

    .section {
      border: 1px solid #000;
      margin-bottom: 4px;
      page-break-inside: avoid;
    }

    .section .t {
      border-bottom: 1px solid #000;
      padding: 2px 4px;
      font-weight: bold;
      font-size: 9pt;
      background-color: #f5f5f5;
    }

    .section .c {
      padding: 4px;
    }

    .row {
      margin-bottom: 2px;
    }

    .label {
      display: inline-block;
      width: 150px;
      font-weight: bold;
      font-size: 7pt;
      vertical-align: top;
    }

    .value {
      display: inline-block;
      width: calc(100% - 155px);
      font-size: 7pt;
    }

    .sq {
      display: inline-block;
      width: 6px;
      height: 6px;
      border: 1px solid #000;
      margin-right: 2px;
      line-height: 6px;
      text-align: center;
      font-weight: bold;
      font-size: 6pt;
      vertical-align: middle;
    }

    .on {
      background: #000;
      color: #fff;
    }

    .item {
      margin: 0.5px 0;
      font-size: 7pt;
    }

    .sign-img {
      max-height: 40px;
      border: none;
      background: transparent;
      background: none !important;
      background-color: transparent !important;
      mix-blend-mode: multiply;
      box-shadow: none !important;
      filter: brightness(1.1) contrast(1.1) saturate(1.1);
      padding: 0 !important;
      margin: 0 !important;
      border-radius: 0 !important;
    }

    .flex2 {
      display: table;
      width: 100%;
      page-break-inside: avoid;
    }

    .flex2 > div {
      display: table-cell;
      width: 50%;
      vertical-align: top;
      padding: 0 3px;
    }

    .closing li {
      margin: 0.5px 0;
      font-size: 7pt;
    }

    .footer-note {
      font-size: 6pt;
      font-style: italic;
      color: #666;
      text-align: center;
      margin-top: 3px;
    }

    .multi-col {
      column-count: 2;
      column-gap: 15px;
    }

    .multi-col-3 {
      column-count: 3;
      column-gap: 10px;
    }

    .compact-section {
      margin-bottom: 2px;
    }

    .signature-line {
      font-size: 6pt;
      margin: 1px 0;
    }
  </style>
</head>
<body>


<div class="page">

  
  <div class="hdr">
    <div class="logo">
      <img src="<?php echo e(public_path('images/logo.png')); ?>" alt="Logo" style="max-height:40px;">
    </div>
    <div class="title">PERMIS DE TRAVAIL SÉCURITAIRE</div>
  </div>

  <div class="hdr nums">
    <div><b>Numéro de permis :</b> <?php echo e($permis->numero_permis); ?></div>
    <div><b>Site :</b> <?php echo e($permis->site->name ?? ''); ?></div>
  </div>

  
  <div class="section compact-section">
    <div class="t">IDENTIFICATION</div>
    <div class="c">
      <div class="row">
        <span class="label">Endroit / Plan :</span>
        <span class="value"><?php echo e($permis->site->name ?? $permis->site_id); ?></span>
      </div>
      <div class="row">
        <span class="label">Durée :</span>
        <span class="value">De <?php echo e($permis->duree_de); ?> à <?php echo e($permis->duree_a); ?></span>
      </div>
      <div class="row">
        <span class="label">Description :</span>
        <span class="value"><?php echo e(Str::limit($permis->description, 100)); ?></span>
      </div>
      <div class="row">
        <span class="label">Plan sécuritaire par :</span>
        <span class="value"><?php echo e($permis->plan_securitaire_par); ?> (<?php echo e($permis->date_analyse); ?>)</span>
      </div>
      <div class="row">
        <span class="label">Demandeur :</span>
        <span class="value"><?php echo e($permis->demandeur); ?></span>
      </div>
      <div class="row">
        <span class="label">Contractant :</span>
        <span class="value"><?php echo e($permis->contractant); ?></span>
      </div>
    </div>
  </div>

  
  <div class="section compact-section">
    <div class="t">TYPE D'ACTIVITÉ</div>
    <div class="c">
      <?php
        $activites = [
          "travail_chaud" => "Travail à chaud",
          "espace_confine" => "Espace confiné",
          "consignation" => "Consignation/Déconsignation",
          "demolition" => "Demolition",
          "echafaudage" => "Échafaudage",
          "lignes_elec" => "Travail a proximité de lignes électriques",
          "structures_temp" => "Structures temporaires",
          "moins_3m_eau" => "Travailler <3m de l'eau",
          "plateforme_aerienne" => "Plateforme aérienne",
          "excavation" => "Excavation",
          "dynamitage" => "Dynamitage",
          "fermeture_route" => "Fermeture route",
          "levage_personnel" => "Levage personnel",
          "radiographie" => "Radiographie",
          "hydrotest" => "HydroTest",
          "lavage_critique" => "Lavage critique",
          "mise_service" => "Mise en service",
          "autre" => "Autre"
        ];
        $isChecked = fn($arr,$k)=> in_array($k, $arr ?? []);
        $box = fn($on)=> '<span class="sq'.($on?' on':'').'">'.($on?'X':'&nbsp;').'</span>';
      ?>

      <div class="multi-col-3">
        <?php $__currentLoopData = $activites; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          <div class="item"><?php echo $box($isChecked($permis->activites, $k)); ?> <?php echo e($lbl); ?></div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      </div>
      
      <?php if($isChecked($permis->activites, 'autre') && $permis->activite_autre): ?>
        <div class="row" style="margin-top: 2px;">
          <span class="label">Autre activité :</span>
          <span class="value"><?php echo e($permis->activite_autre); ?></span>
        </div>
      <?php endif; ?>
    </div>
  </div>

  
  <div class="section compact-section">
    <div class="t">PERMIS SUPPLEMENTAIRE REQUIS</div>
    <div class="c">
      <?php
        $permisSupp = [
          "travail_chaud" => "Travail à chaud",
          "espace_confine" => "Espace confiné",
          "excavation" => "Excavation",
          "consignation" => "Consignation/déconsignation",
          "chute" => "Protection chute",
          "scan" => "SCAN REPORT",
          "isolement" => "ISOLATION DRAWING",
          "levage" => "Étude Levage",
          "deviation" => "Fermeture route",
          "radio" => "Radiographie",
          "hydro" => "Hydro-test",
          "lavage_critique" => "Lavage critique",
        ];
      ?>

      <div class="multi-col-3">
        <?php $__currentLoopData = $permisSupp; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          <div class="item"><?php echo $box($isChecked($permis->permis_supp, $k)); ?> <?php echo e($lbl); ?></div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      </div>
    </div>
  </div>

  
  <div class="section compact-section">
    <div class="t">DANGERS PARTICULIERS</div>
    <div class="c">
      <?php
        $dangers = [
          "glisser" => "Glisser/trébucher/tomber",
          "acces_difficile" => "Accès difficile",
          "chute_hauteur" => "Chute hauteur",
          "mobile_rotatif" => "Équipement mobile",
          "coupe_outil" => "Coupe/perforer",
          "frapper" => "Frapper/Se frapper",
          "pression_souffle" => "Équipement sous pression",
          "brulure" => "Brûlure chaleur/froid",
          "vapeurs" => "Vapeurs inflammables",
          "elec" => "Danger électriques",
          "bruit" => "Bruit",
          "ergonomie" => "Ergonomie",
          "produits" => "Produits chimiques",
          "faible_oxygene" => "Faible oxygène",
          "atmosphere" => "Atmosphère dangereuse",
          "rayonnements" => "Radiations",
          "stress_thermique" => "Stress thermique",
          "poussieres" => "Poussières",
          "meteo" => "Météo",
          "contamination_sol" => "Contamination sol/eau",
          "simultane" => "Opérations simultanées",
          "autre" => "Autre",
          "aucun" => "Aucun"
        ];
      ?>

      <div class="multi-col-3">
        <?php $__currentLoopData = $dangers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          <div class="item"><?php echo $box($isChecked($permis->dangers, $k)); ?> <?php echo e($lbl); ?></div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      </div>
      
      <?php if($isChecked($permis->dangers, 'autre') && $permis->danger_autre): ?>
        <div class="row" style="margin-top: 2px;">
          <span class="label">Autre danger :</span>
          <span class="value"><?php echo e($permis->danger_autre); ?></span>
        </div>
      <?php endif; ?>
    </div>
  </div>

</div>


<div class="page">

  
  <div class="hdr">
    <div class="logo">
      <img src="<?php echo e(public_path('images/logo.png')); ?>" alt="Logo" style="max-height:40px;">
    </div>
    <div class="title">PERMIS DE TRAVAIL SÉCURITAIRE (Suite)</div>
  </div>

  <div class="hdr nums">
    <div><b>Numéro de permis :</b> <?php echo e($permis->numero_permis); ?></div>
    <div><b>Page :</b> 2/2</div>
  </div>

  
  <div class="section compact-section">
    <div class="t">ÉQUIPEMENT DE PROTECTION PERSONNELLE</div>
    <div class="c">
      <div class="row">
        <div class="item"><?php echo $box($permis->epi_sans_additionnel); ?> Équipement de protection additionnel non requis</div>
      </div>

      <div class="flex2">
        <div>
          <div style="font-weight: bold; margin-bottom: 2px; font-size: 7pt;">PROTECTION CHIMIQUE/PHYSIQUE</div>
          <?php
            $epiChimique = [
              "goggles" => "Goggles",
              "ecran" => "Ecran facial",
              "gants" => "Gants",
              "auditive" => "Protection auditive",
              "arc_electrique" => "Protection Arc électrique",
              "chutes" => "Protection chutes",
              "flottaison" => "Flottaison",
            ];
          ?>
          <?php $__currentLoopData = $epiChimique; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->epi_chimique, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
        
        <div>
          <div style="font-weight: bold; margin-bottom: 2px; font-size: 7pt;">PROTECTION RESPIRATOIRE</div>
          <?php
            $epiRespiratoire = [
              "filtres" => "Filtres particules",
              "cartouches" => "Cartouches chimiques",
              "epuration" => "Épuration air soudage",
              "papr" => "PAPR motorisés",
              "adduction" => "Adduction air (Type C)",
            ];
          ?>
          <?php $__currentLoopData = $epiRespiratoire; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->epi_respiratoire, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
      </div>
    </div>
  </div>

  
  <div class="section compact-section">
    <div class="t">EQUIPEMENT DE PROTECTION</div>
    <div class="c">
      <div class="flex2">
        <div>
          <div style="font-weight: bold; margin-bottom: 2px; font-size: 7pt;">COMMUNICATIONS</div>
          <?php
            $equipComms = [
              "radios" => "Radio(s)",
              "signaleurs" => "Signaleurs",
              "avertissement" => "Signaux d'avertissement",
              "perimetre" => "Perimètre sécurité",
            ];
          ?>
          <?php $__currentLoopData = $equipComms; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->equip_comms, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
        
        <div>
          <div style="font-weight: bold; margin-bottom: 2px; font-size: 7pt;">BARRICADES</div>
          <?php
            $equipBarrieres = [
              "barricades" => "Barricades",
              "debit" => "Indicateur débit",
              "manometre" => "Manomètre",
              "surete" => "Soupape sûreté",
              "extincteur" => "Extincteur",
            ];
          ?>
          <?php $__currentLoopData = $equipBarrieres; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->equip_barrieres, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
      </div>

      <div class="flex2" style="margin-top: 4px;">
        <div>
          <div style="font-weight: bold; margin-bottom: 2px; font-size: 7pt;">QUALITÉ AIR</div>
          <?php
            $equipQualiteAir = [
              "detecteur" => "Détecteur gaz/oxygène",
              "echant" => "Échantillonnage",
              "ventilation" => "Ventilation mécanique",
              "anemometre" => "Anémomètre",
            ];
          ?>
          <?php $__currentLoopData = $equipQualiteAir; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->equip_qualite_air, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
        
        <div>
          <div style="font-weight: bold; margin-bottom: 2px; font-size: 7pt;">ÉTINCELLES/CHOCS</div>
          <?php
            $equipEtincelles = [
              "anti_deflag" => "Outils anti-déflagrants",
              "mise_terre" => "Mise à la terre",
              "anti_explosion" => "Éclairage anti-explosion",
              "autres" => "Autres",
            ];
          ?>
          <?php $__currentLoopData = $equipEtincelles; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->equip_etincelles, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
      </div>
    </div>
  </div>

  
  <div class="section compact-section">
    <div class="t">COMMENTAIRES</div>
    <div class="c">
      <div class="value" style="font-size: 7pt;"><?php echo e($permis->commentaires ?: 'Aucun commentaire'); ?></div>
    </div>
  </div>

  
  <div class="section compact-section">
    <div class="t">CONFIRMATIONS</div>
    <div class="c">
      <div class="item"><?php echo $box($permis->confirmation_travail); ?> Travail à faire</div>
      <div class="item"><?php echo $box($permis->confirmation_conditions); ?> Conditions dangereuses et mesures</div>
      <div class="item"><?php echo $box($permis->confirmation_equipement); ?> Équipement protection requis</div>
      <div class="item"><?php echo $box($permis->confirmation_epi); ?> EPI additionnel</div>
    </div>
  </div>

  
  <div class="section compact-section">
    <div class="t">SIGNATURES</div>
    <div class="c">
      <div class="flex2">
        <div>
          <b style="font-size: 7pt;">Superviseur Construction Jacobs</b><br>
          <span style="font-size: 6pt;">Nom : <?php echo e($permis->sig_resp_construction_nom); ?></span><br>
          <span style="font-size: 6pt;">Date : <?php echo e($permis->sig_resp_construction_date); ?></span><br>
          <?php if($permis->sig_resp_construction_file): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->sig_resp_construction_file)); ?>" style="max-height: 30px;">
          <?php endif; ?>
        </div>
        <div>
          <b style="font-size: 7pt;">H&S Manager Jacobs</b><br>
          <span style="font-size: 6pt;">Nom : <?php echo e($permis->sig_resp_hse_nom); ?></span><br>
          <span style="font-size: 6pt;">Date : <?php echo e($permis->sig_resp_hse_date); ?></span><br>
          <?php if($permis->sig_resp_hse_file): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->sig_resp_hse_file)); ?>" style="max-height: 30px;">
          <?php endif; ?>
        </div>
      </div>

      <div class="flex2" style="margin-top: 4px;">
        <div>
          <b style="font-size: 7pt;">Construction Manager ParkX</b><br>
          <span style="font-size: 6pt;">Nom : <?php echo e($permis->cm_parkx_nom); ?></span><br>
          <span style="font-size: 6pt;">Date : <?php echo e($permis->cm_parkx_date); ?></span><br>
          <?php if($permis->cm_parkx_file): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->cm_parkx_file)); ?>" style="max-height: 30px;">
          <?php endif; ?>
        </div>
        <div>
          <b style="font-size: 7pt;">HSE Manager ParkX</b><br>
          <span style="font-size: 6pt;">Nom : <?php echo e($permis->hse_parkx_nom); ?></span><br>
          <span style="font-size: 6pt;">Date : <?php echo e($permis->hse_parkx_date); ?></span><br>
          <?php if($permis->hse_parkx_file): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->hse_parkx_file)); ?>" style="max-height: 30px;">
          <?php endif; ?>
          <?php if($permis->hse_parkx_commentaires): ?>
            <div style="margin-top: 2px; font-size: 6pt;">
              <b>Commentaires HSE :</b> <?php echo e(Str::limit($permis->hse_parkx_commentaires, 50)); ?>

            </div>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </div>

  
  <div class="section compact-section">
    <div class="t">FERMETURE DU PERMIS</div>
    <div class="c">
      <ul class="closing">
        <li><span class="sq">&nbsp;</span> Le personnel assigné a été avisé que le travail est complété.</li>
        <li><span class="sq">&nbsp;</span> Les mesures temporaires, barricades et signaux d'avertissement ont été enlevés.</li>
        <li><span class="sq">&nbsp;</span> Les matériaux, outils et équipements ont été enlevés des lieux de travail.</li>
        <li><span class="sq">&nbsp;</span> La zone de travail a été sécurisée et nettoyée.</li>
        <li><span class="sq">&nbsp;</span> La surveillance post-travaux a été effectuée conformément aux exigences.</li>
        <li><span class="sq">&nbsp;</span> Suivi additionnel requis (spécifier) : ________________________________</li>
      </ul>
      <br>
      <div class="signature-line"><b>Responsable construction (Contractant)</b> Nom : __________________  Date : ________________  Signature : </div>
      <div class="signature-line"><b>Responsable HSE (Contractant)</b> Nom : __________________  Date : ________________  Signature : </div>
      <div class="signature-line"><b>Construction Manager ParkX</b> Nom : __________________  Date : ________________  Signature : </div>
      <div class="signature-line"><b>HSE Manager ParkX</b> Nom : __________________  Date : ________________  Signature : </div>
    </div>
  </div>

  <div class="footer-note">
    Permis de travail sécuritaire - Document à conserver selon les exigences réglementaires
  </div>

</div>

</body>
</html><?php /**PATH C:\Users\ADMIN\Pictures\newparkx\resources\views/pdf/travail_securitaire.blade.php ENDPATH**/ ?>