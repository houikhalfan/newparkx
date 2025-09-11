<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        th, td { border: 1px solid #000; padding: 4px; vertical-align: top; }
        .section-title {
            background: #0E8A5D;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            text-align: left;
            padding: 3px;
        }
        .checkbox { font-family: DejaVu Sans; }
        .header-green { background: #0E8A5D; color: white; font-weight: bold; text-align: center; }
    </style>
</head>
<body>
    
    <table>
        <tr>
            <td rowspan="2" style="text-align:center; font-weight:bold; font-size:14px;">
                <img src="<?php echo e(public_path('images/logo.png')); ?>" height="25"><br>
                PERMIS D’EXCAVATION — CONSTRUCTION
            </td>
            <td class="header-green">NUMÉRO DE PERMIS GÉNÉRAL</td>
            <td><?php echo e($permis->numero_permis_general); ?></td>
        </tr>
        <tr>
            <td class="header-green">NUMÉRO DE PERMIS</td>
            <td><?php echo e($permis->numero_permis); ?></td>
        </tr>
    </table>

    
    <table>
        <tr><th colspan="4" class="section-title">IDENTIFICATION</th></tr>
        <tr>
            <td>Endroit / Plan</td><td><?php echo e($permis->site->name ?? '—'); ?></td>
            <td>Durée</td><td>De <?php echo e($permis->duree_de); ?> à <?php echo e($permis->duree_a); ?></td>
        </tr>
        <tr><td>Description du travail</td><td colspan="3"><?php echo e($permis->description); ?></td></tr>
        <tr>
            <td>Analyse des risques réalisée par</td><td><?php echo e($permis->analyse_par); ?></td>
            <td>Date</td><td><?php echo e($permis->date_analyse); ?></td>
        </tr>
        <tr>
            <td>Demandeur du permis</td><td><?php echo e($permis->demandeur); ?></td>
            <td>Contractant effectuant le travail</td><td><?php echo e($permis->contractant); ?></td>
        </tr>
    </table>

    
   <!-- DANGERS PARTICULIERS -->
<table>
    <tr class="section-title"><td colspan="3">DANGERS PARTICULIERS</td></tr>
    <tr>
        <td style="width:33%">
            <strong>L’excavation est :</strong><br>
            <div class="<?php echo e($permis->danger_aucun ? 'checked' : 'unchecked'); ?> checkbox">Aucun danger particulier</div>
            <div style="<?php echo e($permis->danger_aucun ? 'opacity:0.5' : ''); ?>">
                <?php $__currentLoopData = ['prof_12'=>'> 1,2 mètres de prof.',
                           'prof_18'=>'> 1,8 mètres de prof.',
                           'prof_30'=>'> 3,0 mètres de prof.',
                           'moins_3_rive'=>'< 3 m de la rive',
                           'moins_3_pente'=>'< 3 m d’une pente',
                           'moins_3_route'=>'< 3 m d’une route']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key=>$label): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <div class="<?php echo e(in_array($key, $permis->excavation_est ?? []) ? 'checked' : 'unchecked'); ?> checkbox"><?php echo e($label); ?></div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        </td>
        <td style="width:33%">
            <strong>Conduites/Tuyauterie souterraine :</strong><br>
            <div style="<?php echo e($permis->danger_aucun ? 'opacity:0.5' : ''); ?>">
                <?php $__currentLoopData = ['electrique'=>'Électrique', 'drainage'=>'Drainage', 'incendie'=>'Protection incendie', 'oleoduc'=>'Oléoduc',
                           'eau'=>"Conduite d'eau", 'procede'=>'Conduit de procédé', 'telecom'=>'Câbles téléphoniques', 'fibre'=>'Fibre optique',
                           'fondations'=>'Fondations / Infrastructures', 'bornes'=>'Bornes géodésiques', 'dynamitage'=>'Requiert dynamitage']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key=>$label): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <div class="<?php echo e(in_array($key, $permis->conduites ?? []) ? 'checked' : 'unchecked'); ?> checkbox"><?php echo e($label); ?></div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        </td>
        <td style="width:33%">
            <strong>Situations dangereuses :</strong><br>
            <div style="<?php echo e($permis->danger_aucun ? 'opacity:0.5' : ''); ?>">
                <?php $__currentLoopData = ['pluie'=>'Pluie abondante récemment', 'infiltration'=>"Infiltration d’eau", 'terrain'=>"Terrain instable", 'autre'=>"Autre"]; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key=>$label): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <div class="<?php echo e(in_array($key, $permis->situations ?? []) ? 'checked' : 'unchecked'); ?> checkbox"><?php echo e($label); ?></div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                <?php if($permis->situation_autre): ?>
                    <div><em>Autre : <?php echo e($permis->situation_autre); ?></em></div>
                <?php endif; ?>
            </div>
        </td>
    </tr>
</table>

<!-- COMMENTAIRES -->
<table>
    <tr class="section-title"><td>COMMENTAIRES ET RECOMMANDATIONS PARTICULIÈRES</td></tr>
    <tr>
        <td>
            <div class="<?php echo e($permis->aucun_commentaire ? 'checked' : 'unchecked'); ?> checkbox">Aucun commentaire</div>
            <?php if(!$permis->aucun_commentaire): ?>
                <p><?php echo e($permis->commentaires); ?></p>
            <?php endif; ?>
        </td>
    </tr>
</table>

<!-- EQUIPEMENTS -->
<table>
    <tr class="section-title"><td>ÉQUIPEMENT DE PROTECTION</td></tr>
    <tr>
        <td>
            <div class="<?php echo e($permis->equip_non_requis ? 'checked' : 'unchecked'); ?> checkbox">Équipement de protection additionnel non requis</div>
            <div style="<?php echo e($permis->equip_non_requis ? 'opacity:0.5' : ''); ?>">
                <?php $__currentLoopData = ['stabilite'=>'Note de stabilité du terrain', 'revision_dessins'=>'Révision des dessins', 'identification_ouvrages'=>'Identification des ouvrages souterrains',
                           'barricades_signaux'=>"Barricades et signaux d’avertissement", 'barricades_11m'=>"Barricades 1,1 m si prof > 1,8 m",
                           'excavation_045'=>"Excavation manuelle < 0,45 m d’un conduit", 'degagement_06'=>"Dégagement 0,6 m paroi/équipement",
                           'vehicules_2m'=>"Véhicules interdits à < 2 m", 'empilement_12'=>"Pas d’empilement < 1,2 m", 'echelle_10m'=>"Échelle/rampe d’accès tous les 10 m",
                           'etayage'=>"Étayage"]; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key=>$label): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <div class="<?php echo e(in_array($key, $permis->equip_checks ?? []) ? 'checked' : 'unchecked'); ?> checkbox"><?php echo e($label); ?></div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                <?php if($permis->equip_autre): ?>
                    <div><em>Autre : <?php echo e($permis->equip_autre); ?></em></div>
                <?php endif; ?>
            </div>
        </td>
    </tr>
</table>


    
    <table>
        <tr><th colspan="2" class="section-title">ÉQUIPEMENT DE PROTECTION PERSONNELLE (ÉPI) REQUIS</th></tr>
        <tr>
            <td>Sans ÉPI additionnel <?php echo e($permis->epi_sans_additionnel ? '☑' : '☐'); ?></td>
            <td>
                Harnais de retenue <?php echo e(in_array('harnais', $permis->epi_simples ?? []) ? '☑' : '☐'); ?><br>
                Autre : <?php echo e($permis->epi_autre ?? '—'); ?>

            </td>
        </tr>
    </table>

    
    <table>
        <tr><th class="section-title">ÉQUIPEMENT DE PROTECTION</th></tr>
        <tr><td>
            Non requis <?php echo e($permis->equip_non_requis ? '☑' : '☐'); ?><br>
            <?php $__currentLoopData = ['stabilite'=>'Note de stabilité du terrain','revision_dessins'=>'Révision des dessins','identification_ouvrages'=>'Identification ouvrages','barricades_signaux'=>'Barricades & signaux','barricades_11m'=>'Barricades 1,1m si prof>1,8m','excavation_045'=>'Excavation manuelle <0,45m conduit','degagement_06'=>'Dégagement 0,6m','vehicules_2m'=>'Véhicules interdits <2m','empilement_12'=>'Pas empilement <1,2m','echelle_10m'=>'Échelle/rampe chaque 10m','etayage'=>'Étayaage']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $label): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="checkbox"><?php echo e(in_array($k, $permis->equip_checks ?? []) ? '☑' : '☐'); ?> <?php echo e($label); ?></div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            Autre : <?php echo e($permis->equip_autre ?? '—'); ?>

        </td></tr>
    </table>

    
    <table>
        <tr><th class="section-title">COMMENTAIRES ET RECOMMANDATIONS PARTICULIÈRES</th></tr>
        <tr>
            <td>
                Aucun commentaire <?php echo e($permis->aucun_commentaire ? '☑' : '☐'); ?><br>
                Commentaires : <?php echo e($permis->commentaires ?? '—'); ?>

            </td>
        </tr>
    </table>

    
    <table>
        <tr><th colspan="3" class="section-title">PROPRIÉTAIRE DES LIEUX</th></tr>
        <tr>
            <td>Nom : <?php echo e($permis->proprietaire_nom); ?></td>
            <td>Date : <?php echo e($permis->proprietaire_date); ?></td>
            <td>
                <?php if($permis->proprietaire_signature): ?>
                    <img src="<?php echo e(public_path('storage/'.$permis->proprietaire_signature)); ?>" height="40">
                <?php endif; ?>
            </td>
        </tr>
    </table>

    
    <table>
        <tr><th colspan="3" class="section-title">SIGNATURES D’AUTORISATION DU PERMIS</th></tr>
        <tr>
            <td>Responsable construction (Contractant)</td>
            <td><?php echo e($permis->sig_resp_construction_nom); ?><br>Date : <?php echo e($permis->sig_resp_construction_date); ?></td>
            <td>
                <?php if($permis->sig_resp_construction_file): ?>
                    <img src="<?php echo e(public_path('storage/'.$permis->sig_resp_construction_file)); ?>" height="40">
                <?php endif; ?>
            </td>
        </tr>
        <tr>
            <td>Responsable HSE (Contractant)</td>
            <td><?php echo e($permis->sig_resp_hse_nom); ?><br>Date : <?php echo e($permis->sig_resp_hse_date); ?></td>
            <td>
                <?php if($permis->sig_resp_hse_file): ?>
                    <img src="<?php echo e(public_path('storage/'.$permis->sig_resp_hse_file)); ?>" height="40">
                <?php endif; ?>
            </td>
        </tr>
    </table>
    <!-- ================== FERMETURE DU PERMIS ================== -->
<table width="100%" border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; margin-top:20px;">
    <tr style="background:#0E8A5D; color:white;">
        <td colspan="3"><strong>FERMETURE DU PERMIS</strong></td>
    </tr>
    <tr>
        <td colspan="3" style="font-size:12px; text-align:center; padding:10px;">
            <em>À remplir par ParkX (Construction Manager & HSE Manager) après la fin des travaux</em>
        </td>
    </tr>
    <tr>
        <td style="width:60%">✔ Le personnel assigné a été avisé que le travail est complété.</td>
        <td style="width:20%">[  ] Oui</td>
        <td style="width:20%">[  ] Non</td>
    </tr>
    <tr>
        <td>✔ Les barricades et signaux d’avertissement ont été enlevés.</td>
        <td>[  ] Oui</td>
        <td>[  ] Non</td>
    </tr>
    <tr>
        <td>✔ Les matériaux, outils et équipements ont été retirés.</td>
        <td>[  ] Oui</td>
        <td>[  ] Non</td>
    </tr>
    <tr>
        <td>✔ L’excavation a été remblayée.</td>
        <td>[  ] Oui</td>
        <td>[  ] Non</td>
    </tr>
    <tr>
        <td>✔ Les dessins ont été mis à jour.</td>
        <td>[  ] Oui</td>
        <td>[  ] Non</td>
    </tr>
    <tr>
        <td>✔ Suivi additionnel requis (préciser) :</td>
        <td colspan="2">________________________________________</td>
    </tr>
    <tr>
        <td><strong>Responsable construction ParkX</strong><br>Nom : ____________ <br>Date : _______ <br>Signature : _________</td>
        <td colspan="2"><strong>Responsable HSE ParkX</strong><br>Nom : ____________ <br>Date : _______ <br>Signature : _________</td>
    </tr>
</table>


    
    <p style="font-size:10px;">
        Document généré le <?php echo e(now()->format('Y-m-d H:i')); ?> <br>
        <b>Statut actuel :</b> <?php echo e(strtoupper($permis->status)); ?>

    </p>
</body>
</html>
<?php /**PATH C:\Users\ADMIN\Pictures\newparkx\resources\views/pdf/permis_excavation.blade.php ENDPATH**/ ?>