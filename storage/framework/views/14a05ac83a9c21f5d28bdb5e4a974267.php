
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Permis d’excavation</title>
  <style>
    body{ font-family: DejaVu Sans, Arial, Helvetica, sans-serif; font-size:11px; line-height:1.35; color:#111; }
    .page{ border:2px solid #0d6b42; padding:10px; }
    .hdr{ display:table; width:100%; border:2px solid #0d6b42; margin-bottom:8px;}
    .hdr .title{ display:table-cell; background:#0E8A5D; color:#fff; text-align:center; font-weight:bold; padding:6px; font-size:14px; }
    .hdr .nums{ display:table; width:100%; border-top:1px solid #0d6b42; }
    .hdr .nums div{ display:table-cell; padding:6px 8px; border-left:1px solid #0d6b42; font-size:10px; }
    .section{ border:1px solid #000; margin-bottom:8px; }
    .section .t{ background:#e8f3ed; border-bottom:1px solid #000; padding:5px 8px; font-weight:bold; }
    .section .c{ padding:8px; }
    .row{ margin-bottom:4px; }
    .label{ display:inline-block; width:200px; font-weight:bold; }

    .sq{ display:inline-block; width:10px; height:10px; border:1.2px solid #000; margin-right:5px; line-height:10px; text-align:center; font-weight:bold; font-size:9px; }
    .on{ background:#0E8A5D; color:#fff; }
    .muted{ color:#444; }

    table{ width:100%; border-collapse:collapse; }
    .grid th{ background:#f2f6f4; border:1px solid #000; padding:5px 6px; text-align:left; font-size:10px; }
    .grid td{ border:1px solid #000; vertical-align:top; padding:6px 8px; }
    .item{ margin:2px 0; }

    .sign-img{ max-height:60px; border:1px solid #aaa; margin-top:4px; }
    .flex2{ display:table; width:100%; }
    .flex2 > div{ display:table-cell; width:50%; vertical-align:top; }

    .closing li{ margin:2px 0; }
  </style>
</head>
<body>
<div class="page">

  
  <div class="hdr">
    <div class="title">PERMIS D’EXCAVATION — CONSTRUCTION</div>
    <div class="nums">
      <div><b>Numéro de permis général :</b> <?php echo e($permis->numero_permis_general); ?></div>
      <div><b>Numéro de permis :</b> <?php echo e($permis->numero_permis); ?></div>
    </div>
  </div>

  
  <div class="section">
    <div class="t">Identification</div>
    <div class="c">
      <div class="row"><span class="label">Endroit / Plan :</span> <?php echo e($permis->site->name ?? ''); ?></div>
      <div class="row"><span class="label">Durée :</span> <?php echo e($permis->duree_de); ?> → <?php echo e($permis->duree_a); ?></div>
      <div class="row"><span class="label">Description du travail :</span> <?php echo e($permis->description); ?></div>
      <div class="row"><span class="label">Analyse des risques réalisée par :</span> <?php echo e($permis->analyse_par); ?> &nbsp; <span class="muted">(<?php echo e($permis->date_analyse); ?>)</span></div>
      <div class="row"><span class="label">Demandeur du permis :</span> <?php echo e($permis->demandeur); ?></div>
      <div class="row"><span class="label">Contractant effectuant le travail :</span> <?php echo e($permis->contractant); ?></div>
    </div>
  </div>

  
  <?php
    $optExcav = [
      "prof_12" => "> 1,2 mètres de prof.",
      "prof_18" => "> 1,8 mètres de prof.",
      "prof_30" => "> 3,0 mètres de prof.",
      "moins_3_rive" => "< 3 mètres de : du bord de la rive",
      "moins_3_pente" => "< 3 mètres de : d'une pente",
      "moins_3_route" => "< 3 mètres de : d'une route",
    ];
    $optConduites = [
      "electrique" => "Électrique",
      "drainage" => "Drainage",
      "incendie" => "Protection incendie",
      "oleoduc" => "Oléoduc",
      "eau" => "Conduite d'eau",
      "procede" => "Conduit de procédé",
      "telecom" => "Câbles téléphoniques",
      "fibre" => "Fibre optique",
      "fondations" => "Fondations / Infrastructures",
      "bornes" => "Bornes géodésiques",
      "dynamitage" => "Requiert dynamitage",
    ];
    $optSitu = [
      "pluie" => "Pluie abondante récemment",
      "infiltration" => "Infiltration d'eau souterraine",
      "terrain" => "Terrain instable",
      "autre" => "Autre (préciser ci-dessous)",
    ];
    $optEpi = [
      "harnais" => "Harnaisiens de retenue",
    ];
    $optEquip = [
      "stabilite" => "Note de stabilité du terrain et des parois",
      "revision_dessins" => "Révision des dessins",
      "identification_ouvrages" => "Identification des ouvrages souterrains",
      "barricades_signaux" => "Barricades et signaux d'avertissement",
      "barricades_11m" => "Barricades de 1,1 mètres installées à proximité des excavations de plus de 1,8 mètres de profondeur",
      "excavation_045" => "Excavation manuelle à moins de 0,45 mètre d'un conduit souterrain",
      "degagement_06" => "Dégagement de 0,6 mètre entre la paroi de l'excavation et l'équipement",
      "vehicules_2m" => "Véhicules interdits à moins de 2 mètres de l'excavation",
      "empilement_12" => "Aucun empilement de matériel à moins de 1,2 mètres de l'excavation",
      "echelle_10m" => "Échelle ou rampe d'accès à tous les 10 m",
      "etayage" => "Étayage",
    ];

    $isChecked = fn($arr,$k)=> in_array($k, $arr ?? []);
    $box = fn($on)=> '<span class="sq'.($on?' on':'').'">'.($on?'X':'&nbsp;').'</span>';
  ?>

  
  <div class="section">
    <div class="t">Dangers particuliers</div>
    <div class="c">
      <div class="row"><span class="label">Aucun danger :</span><?php echo $box($permis->danger_aucun); ?></div>

      <table class="grid">
        <tr>
          <th>L’excavation est</th>
          <th>Conduites / Tuyauterie souterraine</th>
          <th>Situations dangereuses</th>
          <th>Remarque</th>
        </tr>
        <tr>
          <td>
            <?php $__currentLoopData = $optExcav; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <div class="item"><?php echo $box($isChecked($permis->excavation_est,$k)); ?> <?php echo e($lbl); ?></div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </td>
          <td>
            <?php $__currentLoopData = $optConduites; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <div class="item"><?php echo $box($isChecked($permis->conduites,$k)); ?> <?php echo e($lbl); ?></div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </td>
          <td>
            <?php $__currentLoopData = $optSitu; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <div class="item"><?php echo $box($isChecked($permis->situations,$k)); ?> <?php echo e($lbl); ?></div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </td>
          <td>
            <?php if(!empty($permis->situation_autre)): ?> <?php echo e($permis->situation_autre); ?> <?php endif; ?>
          </td>
        </tr>
      </table>
    </div>
  </div>

  
  <div class="section">
    <div class="t">Équipement de protection personnelle (ÉPI) requis</div>
    <div class="c">
      <div class="row"><span class="label">Sans ÉPI additionnel :</span><?php echo $box($permis->epi_sans_additionnel); ?></div>
      <?php $__currentLoopData = $optEpi; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k=>$lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="item"><?php echo $box($isChecked($permis->epi_simples,$k)); ?> <?php echo e($lbl); ?></div>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      <?php if($permis->epi_autre): ?>
        <div class="item"><?php echo $box(true); ?> Autre : <?php echo e($permis->epi_autre); ?></div>
      <?php endif; ?>
    </div>
  </div>

  
  <div class="section">
    <div class="t">Équipement de protection</div>
    <div class="c">
      <div class="row"><span class="label">Équipement additionnel non requis :</span><?php echo $box($permis->equip_non_requis); ?></div>
      <?php $__currentLoopData = $optEquip; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k=>$lbl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="item"><?php echo $box($isChecked($permis->equip_checks,$k)); ?> <?php echo e($lbl); ?></div>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      <?php if($permis->equip_autre): ?>
        <div class="item"><?php echo $box(true); ?> Autre : <?php echo e($permis->equip_autre); ?></div>
      <?php endif; ?>
    </div>
  </div>

  
  <div class="section">
    <div class="t">Commentaires et recommandations particulières</div>
    <div class="c">
      <div class="row"><span class="label">Aucun commentaire :</span><?php echo $box($permis->aucun_commentaire); ?></div>
      <?php if(!$permis->aucun_commentaire && $permis->commentaires): ?>
        <div class="row"><?php echo e($permis->commentaires); ?></div>
      <?php endif; ?>

  <div class="t">Propriétaire des lieux</div>
  <div class="c">
    <div class="row"><span class="label">Nom :</span> <?php echo e($permis->proprietaire_nom); ?></div>
    <div class="row"><span class="label">Date :</span> <?php echo e($permis->proprietaire_date); ?></div>
    <?php if($permis->proprietaire_signature): ?>
      <div class="row">
        <span class="label">Signature :</span><br>
        <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->proprietaire_signature)); ?>">
      </div>
    <?php endif; ?>

</div>

    </div>
  </div>

  
  <div class="section">
    <div class="t">Signatures d’autorisation de permis</div>
    <div class="c">
      <div class="row" style="margin-bottom:6px; font-weight:bold;">Vérifications</div>
      <div class="item"><?php echo $box($permis->autor_q1); ?> Les infrastructures souterraines sont identifiées et marquées sur le terrain.</div>
      <div class="item"><?php echo $box($permis->autor_q2); ?> Les mesures temporaires (barricades, signaux…) sont installées pour protéger la zone.</div>
      <div class="item"><?php echo $box($permis->autor_q3); ?> L’impact sur la circulation a été évalué et les permis requis ont été demandés.</div>

      <hr style="border:0; border-top:1px solid #000; margin:8px 0;">

      <div class="flex2">
        <div>
          <b>Responsable construction (Contractant)</b><br>
          Nom : <?php echo e($permis->sig_resp_construction_nom); ?><br>
          Date : <?php echo e($permis->sig_resp_construction_date); ?><br>
          <?php if($permis->sig_resp_construction_file): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->sig_resp_construction_file)); ?>">
          <?php endif; ?>
        </div>
        <div>
          <b>Responsable HSE (Contractant)</b><br>
          Nom : <?php echo e($permis->sig_resp_hse_nom); ?><br>
          Date : <?php echo e($permis->sig_resp_hse_date); ?><br>
          <?php if($permis->sig_resp_hse_file): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->sig_resp_hse_file)); ?>">
          <?php endif; ?>
        </div>
      </div>

      <div class="flex2" style="margin-top:8px;">
        <div>
          <b>Construction Manager ParkX</b><br>
          Nom : <?php echo e($permis->cm_parkx_nom); ?><br>
          Date : <?php echo e($permis->cm_parkx_date); ?><br>
          <?php if($permis->cm_parkx_file): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->cm_parkx_file)); ?>">
          <?php endif; ?>
        </div>
        <div>
          <b>HSE Manager ParkX</b><br>
          Nom : <?php echo e($permis->hse_parkx_nom); ?><br>
          Date : <?php echo e($permis->hse_parkx_date); ?><br>
          <?php if($permis->hse_parkx_file): ?>
            <img class="sign-img" src="<?php echo e(public_path('storage/'.$permis->hse_parkx_file)); ?>">
          <?php endif; ?>
        </div>
      </div>
    </div>
  </div>

  
  <div class="section">
    <div class="t">Fermeture du permis (à remplir physiquement)</div>
    <div class="c">
      <ul class="closing">
        <li><span class="sq">&nbsp;</span> Le personnel assigné a été avisé que le travail est complété.</li>
        <li><span class="sq">&nbsp;</span> Les mesures temporaires, barricades et signaux d’avertissement ont été enlevés.</li>
        <li><span class="sq">&nbsp;</span> Les matériaux, outils et équipements ont été enlevés des lieux de travail.</li>
        <li><span class="sq">&nbsp;</span> L’excavation a été remblayée.</li>
        <li><span class="sq">&nbsp;</span> Les dessins ont été mis à jour.</li>
        <li><span class="sq">&nbsp;</span> Suivi additionnel requis (spécifier) : ................................................</li>
      </ul>
      <br>
      <div class="row"><b>Responsable construction (Contractant)</b> — Nom : __________  Date : __________  Signature : __________</div>
      <div class="row"><b>Responsable HSE (Contractant)</b> — Nom : __________  Date : __________  Signature : __________</div>
      <div class="row"><b>Construction Manager ParkX</b> — Nom : __________  Date : __________  Signature : __________</div>
      <div class="row"><b>HSE Manager ParkX</b> — Nom : __________  Date : __________  Signature : __________</div>
    </div>
  </div>

</div>
</body>
</html>
<?php /**PATH C:\Users\ADMIN\Pictures\newparkx\resources\views/pdf/excavation.blade.php ENDPATH**/ ?>