<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Permis de travail à chaud</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 9pt;
      line-height: 1.3;
      color: #000;
      margin: 0;
      padding: 0;
    }

    .page {
      border: 2px solid #000;
      padding: 8px;
      margin-bottom: 10px;
      page-break-after: always;
    }

    .page:last-child {
      page-break-after: auto;
    }

    .hdr {
      display: table;
      width: 100%;
      border: 2px solid #000;
      margin-bottom: 6px;
    }

    .hdr .logo {
      display: table-cell;
      width: 70px;
      text-align: center;
      vertical-align: middle;
      padding: 4px;
    }

    .hdr .title {
      display: table-cell;
      text-align: center;
      font-weight: bold;
      font-size: 16pt;
      vertical-align: middle;
    }

    .hdr .nums {
      display: table;
      width: 100%;
      border-top: 1px solid #000;
    }

    .hdr .nums div {
      display: table-cell;
      padding: 4px 6px;
      border-left: 1px solid #000;
      font-size: 8pt;
    }

    .section {
      border: 1px solid #000;
      margin-bottom: 6px;
      page-break-inside: avoid;
    }

    .section .t {
      border-bottom: 1px solid #000;
      padding: 3px 6px;
      font-weight: bold;
      font-size: 10pt;
      background-color: #f5f5f5;
    }

    .section .c {
      padding: 6px;
    }

    .row {
      margin-bottom: 3px;
    }

    .label {
      display: inline-block;
      width: 180px;
      font-weight: bold;
      font-size: 8pt;
      vertical-align: top;
    }

    .value {
      display: inline-block;
      width: calc(100% - 185px);
      font-size: 8pt;
    }

    .sq {
      display: inline-block;
      width: 8px;
      height: 8px;
      border: 1px solid #000;
      margin-right: 3px;
      line-height: 8px;
      text-align: center;
      font-weight: bold;
      font-size: 7pt;
      vertical-align: middle;
    }

    .on {
      background: #000;
      color: #fff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: avoid;
      font-size: 8pt;
    }

    .grid th {
      border: 1px solid #000;
      padding: 3px 4px;
      text-align: left;
      background-color: #f5f5f5;
    }

    .grid td {
      border: 1px solid #000;
      vertical-align: top;
      padding: 4px 6px;
    }

    .item {
      margin: 1px 0;
    }

    .sign-img {
      max-height: 50px;
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
      padding: 0 5px;
    }

    .closing li {
      margin: 1px 0;
      font-size: 8pt;
    }

    .checkbox-group {
      margin-bottom: 4px;
    }

    .footer-note {
      font-size: 7pt;
      font-style: italic;
      color: #666;
      text-align: center;
      margin-top: 5px;
    }

    .compact-table td {
      padding: 2px 4px;
    }

    .signature-section {
      margin-top: 8px;
      border-top: 1px solid #000;
      padding-top: 6px;
    }
  </style>
</head>
<body>


<div class="page">

  
  <div class="hdr">
    <div class="logo">
      <img src="<?php echo e(public_path('images/logo.png')); ?>" alt="Logo" style="max-height:50px;">
    </div>
    <div class="title">PERMIS DE TRAVAIL À CHAUD</div>
  </div>

  <div class="hdr nums">
    <div><b>Numéro de permis :</b> <?php echo e($permis->numero_permis); ?></div>
    <div><b>Site :</b> <?php echo e($permis->site->name ?? ''); ?></div>
  </div>

  
  <div class="section">
    <div class="t">IDENTIFICATION</div>
    <div class="c">
      <div class="row">
        <span class="label">Endroit :</span>
        <span class="value"><?php echo e($permis->site->name ?? $permis->site_id); ?></span>
      </div>
      <div class="row">
        <span class="label">Période :</span>
        <span class="value">De <?php echo e($permis->date_debut); ?> à <?php echo e($permis->date_fin); ?></span>
      </div>
      <div class="row">
        <span class="label">Description de la tâche :</span>
        <span class="value"><?php echo e($permis->description_tache); ?></span>
      </div>
      <div class="row">
        <span class="label">Plan sécuritaire réalisé par :</span>
        <span class="value"><?php echo e($permis->plan_securitaire_par); ?> (<?php echo e($permis->date_plan_securitaire); ?>)</span>
      </div>
      <div class="row">
        <span class="label">Contractant demandeur :</span>
        <span class="value"><?php echo e($permis->contractant_demandeur); ?></span>
      </div>
      <div class="row">
        <span class="label">Contractant effectuant :</span>
        <span class="value"><?php echo e($permis->contractant_travail); ?></span>
      </div>
    </div>
  </div>

  
  <div class="section">
    <div class="t">TYPE D'ACTIVITÉ</div>
    <div class="c">
      <?php
        $activites = [
          "soudage_arc" => "Soudage à l'arc",
          "decoupage_arc" => "Découpage à l'arc", 
          "soudage_mig" => "Soudage MIG",
          "soudage_tig" => "Soudage TIG",
          "decoupage_plasma" => "Découpage au plasma",
          "brasage_soudure" => "Brasage/Soudure",
          "oxysoudage" => "Oxysoudage",
          "oxycoupage" => "Oxycoupage",
          "decoupage_mecanique" => "Découpage/meulage mécanique",
          "autre" => "Autre"
        ];
        $isChecked = fn($arr,$k)=> in_array($k, $arr ?? []);
        $box = fn($on)=> '<span class="sq'.($on?' on':'').'">'.($on?'X':'&nbsp;').'</span>';
      ?>

      <table class="compact-table">
        <tr>
          <?php $__currentLoopData = array_chunk($activites, 5, true); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $chunk): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          <td style="width: 50%;">
            <?php $__currentLoopData = $chunk; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <div class="item"><?php echo $box($isChecked($permis->activites, $k)); ?> <?php echo e($lbl); ?></div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </td>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tr>
      </table>
      
      <?php if($isChecked($permis->activites, 'autre') && $permis->activite_autre): ?>
        <div class="row" style="margin-top: 4px;">
          <span class="label">Autre activité :</span>
          <span class="value"><?php echo e($permis->activite_autre); ?></span>
        </div>
      <?php endif; ?>
    </div>
  </div>

  
  <div class="section">
    <div class="t">DANGERS PARTICULIERS</div>
    <div class="c">
      <?php
        $dangers = [
          "inflammable_11m" => "Matériel ou produit inflammable à moins de 11m",
          "produits_chimiques" => "Présence de produits chimiques",
          "travail_machinerie" => "Travail à chaud sur machinerie/équipement",
          "ouverture_plancher" => "Ouverture dans le plancher",
          "poussieres_inflammables" => "Présence de poussières inflammables/combustibles",
          "espace_confine" => "Travail en espace confiné",
          "faible_oxygene" => "Faible concentration en oxygène",
          "chaleur_rayonnante" => "Chaleur rayonnante se propageant à des matières combustibles",
          "vapeurs_inflammables" => "Présence de vapeurs inflammables/combustibles",
          "autre" => "Autre"
        ];
      ?>

      <table class="compact-table">
        <tr>
          <?php $__currentLoopData = array_chunk($dangers, 5, true); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $chunk): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          <td style="width: 50%;">
            <?php $__currentLoopData = $chunk; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <div class="item"><?php echo $box($isChecked($permis->dangers, $k)); ?> <?php echo e($lbl); ?></div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </td>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tr>
      </table>
      
      <?php if($isChecked($permis->dangers, 'autre') && $permis->danger_autre): ?>
        <div class="row" style="margin-top: 4px;">
          <span class="label">Autre danger :</span>
          <span class="value"><?php echo e($permis->danger_autre); ?></span>
        </div>
      <?php endif; ?>
    </div>
  </div>

  
  <div class="section">
    <div class="t">ÉQUIPEMENT DE PROTECTION PERSONNELLE REQUIS</div>
    <div class="c">
      <div class="row" style="background-color: #e8f4fd; padding: 3px; margin-bottom: 4px;">
        <em>Lunettes de sécurité, chapeau, bottes, gants et manches longues sont toujours requis</em>
      </div>

      <div class="flex2">
        <div>
          <div style="font-weight: bold; margin-bottom: 3px;">PROTECTION PHYSIQUE</div>
          <?php
            $protectionPhysique = [
              "casque_soudage" => "Casque de Soudage",
              "goggles_soudage" => "Goggles de soudage", 
              "ecran_facial" => "Ecran Facial",
              "gants_soudage" => "Gants (soudage, résistants à la chaleur)",
              "protection_auditive" => "Protection auditive",
              "vetements" => "Vêtements (tablier de soudage, résistants au flammes, etc.)",
              "autre" => "Autres"
            ];
          ?>
          <?php $__currentLoopData = $protectionPhysique; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->protection_physique, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          <?php if($isChecked($permis->protection_physique, 'autre') && $permis->protection_physique_autre): ?>
            <div class="item" style="margin-left: 15px;">→ <?php echo e($permis->protection_physique_autre); ?></div>
          <?php endif; ?>
        </div>
        
        <div>
          <div style="font-weight: bold; margin-bottom: 3px;">PROTECTION RESPIRATOIRE</div>
          <?php
            $protectionRespiratoire = [
              "filtres_particules" => "Appareils à filtres à particules",
              "cartouches_chimiques" => "Appareils à cartouches chimiques", 
              "epuration_air" => "Appareil à épuration d'air soudage",
              "epuration_air_motorises" => "Appareil à épuration d'air motorisés"
            ];
          ?>
          <?php $__currentLoopData = $protectionRespiratoire; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->protection_respiratoire, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
      </div>
    </div>
  </div>

</div>


<div class="page">

  
  <div class="hdr">
    <div class="logo">
      <img src="<?php echo e(public_path('images/logo.png')); ?>" alt="Logo" style="max-height:50px;">
    </div>
    <div class="title">PERMIS DE TRAVAIL À CHAUD (Suite)</div>
  </div>

  <div class="hdr nums">
    <div><b>Numéro de permis :</b> <?php echo e($permis->numero_permis); ?></div>
    <div><b>Page :</b> 2/2</div>
  </div>

  
  <div class="section">
    <div class="t">ÉQUIPEMENT DE PROTECTION</div>
    <div class="c">
      <div class="flex2">
        <div>
          <div style="font-weight: bold; margin-bottom: 3px;">PROTECTION INCENDIE</div>
          <?php
            $protectionIncendie = [
              "ecran_soudage" => "Écran de soudage",
              "couverture_ignifuge" => "Couverture ignifuge",
              "extincteur" => "Extincteur (à moins de 3 mètres)",
              "boyau_arrosage" => "Boyau d'arrosage", 
              "autre" => "Autre"
            ];
          ?>
          <?php $__currentLoopData = $protectionIncendie; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->protection_incendie, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          <?php if($isChecked($permis->protection_incendie, 'autre') && $permis->protection_incendie_autre): ?>
            <div class="item" style="margin-left: 15px;">→ <?php echo e($permis->protection_incendie_autre); ?></div>
          <?php endif; ?>
        </div>
        
        <div>
          <div style="font-weight: bold; margin-bottom: 3px;">ÉQUIPEMENT D'INSPECTION</div>
          <?php
            $equipementInspection = [
              "cables_pinces_terre" => "Câbles/pinces de mise à la terre",
              "cable_alimentation" => "Câble d'alimentation pour poste de soudage",
              "jauges_boyaux" => "Jauges/Boyaux/Intercepteurs de rentrée de flamme",
              "cylindre_attache" => "Cylindre attaché adéquatement",
              "ouvertures_obstruées" => "Ouvertures de plancher obstruées"
            ];
          ?>
          <?php $__currentLoopData = $equipementInspection; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->equipement_inspection, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
      </div>

      <div class="flex2" style="margin-top: 6px;">
        <div>
          <div style="font-weight: bold; margin-bottom: 3px;">PERMIS</div>
          <?php
            $permisRequis = [
              "espace_clos" => "Espace clos",
              "etiquetage_verrouillage" => "Étiquetage/Verrouillage",
              "qualite_air" => "Qualité de l'air",
              "ventilation_mecanique" => "Ventilation mécanique", 
              "ventilation_locale" => "Ventilation locale"
            ];
          ?>
          <?php $__currentLoopData = $permisRequis; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->permis_requis, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
        
        <div>
          <div style="font-weight: bold; margin-bottom: 3px;">SURVEILLANCE REQUISE</div>
          <?php
            $surveillance = [
              "continue_30min" => "Continue 30 min après fin de travaux",
              "2h_apres" => "2 heures après la fin des travaux"
            ];
          ?>
          <?php $__currentLoopData = $surveillance; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item"><?php echo $box($isChecked($permis->surveillance_requise, $k)); ?> <?php echo e($lbl); ?></div>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
      </div>
    </div>
  </div>

  
  <div class="section">
    <div class="t">COMMENTAIRES ET RECOMMANDATIONS PARTICULIÈRES</div>
    <div class="c">
      <?php if($permis->aucun_commentaire): ?>
        <div class="item"><?php echo $box(true); ?> Aucun commentaire additionnel ou recommandation</div>
      <?php else: ?>
        <div class="value"><?php echo e($permis->commentaires); ?></div>
      <?php endif; ?>
    </div>
  </div>

  
  <div class="section">
    <div class="t">SIGNATURES D'AUTORISATION DE PERMIS (CONTRACTANT)</div>
    <div class="c">
      <div class="flex2">
        <div>
          <b>Responsable construction</b><br>
          Nom : <?php echo e($permis->resp_construction_nom); ?><br>
          Date : <?php echo e($permis->resp_construction_date); ?><br>
          <?php if($permis->resp_construction_signature): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->resp_construction_signature)); ?>">
          <?php endif; ?>
        </div>
        <div>
          <b>Responsable HSE</b><br>
          Nom : <?php echo e($permis->resp_hse_nom); ?><br>
          Date : <?php echo e($permis->resp_hse_date); ?><br>
          <?php if($permis->resp_hse_signature): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->resp_hse_signature)); ?>">
          <?php endif; ?>
        </div>
      </div>
    </div>
  </div>

  
  <div class="section">
    <div class="t">VALIDATION PARKX</div>
    <div class="c">
      <div class="flex2">
        <div>
          <b>Construction Manager ParkX</b><br>
          Nom : <?php echo e($permis->cm_parkx_nom); ?><br>
          Date : <?php echo e($permis->cm_parkx_date); ?><br>
          <?php if($permis->cm_parkx_signature): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->cm_parkx_signature)); ?>">
          <?php endif; ?>
        </div>
        <div>
          <b>HSE Manager ParkX</b><br>
          Nom : <?php echo e($permis->hse_parkx_nom); ?><br>
          Date : <?php echo e($permis->hse_parkx_date); ?><br>
          <?php if($permis->hse_parkx_signature): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->hse_parkx_signature)); ?>">
          <?php endif; ?>
          <?php if($permis->hse_parkx_commentaires): ?>
            <div style="margin-top: 3px; font-size: 7pt;">
              <b>Commentaires HSE :</b> <?php echo e($permis->hse_parkx_commentaires); ?>

            </div>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </div>

  
  <div class="section">
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
      <div class="row"><b>Responsable construction (Contractant)</b> Nom : __________________  Date : ________________  Signature : </div>
      <div class="row"><b>Responsable HSE (Contractant)</b> Nom : __________________  Date : ________________  Signature : </div>
      <div class="row"><b>Construction Manager ParkX</b> Nom : __________________  Date : ________________  Signature : </div>
      <div class="row"><b>HSE Manager ParkX</b> Nom : __________________  Date : ________________  Signature : </div>
    </div>
  </div>

  <div class="footer-note">
    Permis de travail à chaud - Document à conserver selon les exigences réglementaires
  </div>

</div>

</body>
</html><?php /**PATH C:\Users\ADMIN\Pictures\newparkx\resources\views/pdf/travail_chaud.blade.php ENDPATH**/ ?>