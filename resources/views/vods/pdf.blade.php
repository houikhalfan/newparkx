<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>VOD #{{ $vod->id }}</title>
  <style>
    /* DomPDF-friendly base styles */
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color:#111; }
    .muted { color:#666; }
    .box { border:1px solid #ddd; padding:10px; border-radius:6px; }
    ul { margin:0; padding-left:16px; }

    table { width:100%; border-collapse: collapse; }
    th, td { border:1px solid #eee; padding:6px; text-align:left; vertical-align: top; }

    /* Images */
    img { border:1px solid #eee; }
    .photo-wide { width:100%; height:auto; max-height:320px; } /* full table width */

    /* --- Top bar --- */
    .topbar { width:100%; color:#fff; background:#0a2a5a; border:1px solid #0a2a5a; }
    .topbar td { border:1px solid #0a2a5a; padding:10px 12px; }
    .topbar .logo  { width:22%; }
    .topbar .title { width:56%; text-align:center; font-weight:bold; }
    .topbar .meta  { width:22%; text-align:right; font-size:12px; line-height:1.5; }
    .title-main { font-size:16px; }
    .top-divider { height:2px; background:#0a2a5a; margin:6px 0 18px; border:none; }

    /* Section bars */
    .section-bar { background:#000; color:#fff; text-align:center; font-weight:bold; padding:6px 10px; margin:22px 0 10px; }
    .section-bar small { font-weight:normal; font-style:italic; }

    /* Info grid widths */
    .info-grid td{ border:1px solid #ddd; padding:8px 10px; }
    .w-33{ width:33.33%; }

    /* Horizontal list tables (label/value rows + full-width photo row) */
    .hlist th, .hlist td { border:1px solid #eee; padding:6px; vertical-align:top; }
    .hlist .label { width:160px; background:#fafafa; font-weight:bold; }
    .hlist .spacer { border-top:none; }
  </style>
</head>
<body>
@php
    // Date d’émission (création du VOD) ou aujourd’hui
    $emission = $vod->created_at
        ? \Carbon\Carbon::parse($vod->created_at)->format('d/m/Y')
        : now()->format('d/m/Y');

    // Date de la visite (robuste même si string)
    $dateVisite = '—';
    $d = $vod->getAttribute('date'); // peut être Carbon ou string
    if ($d instanceof \Carbon\CarbonInterface) {
        $dateVisite = $d->format('d/m/Y');
    } elseif (!empty($d)) {
        try { $dateVisite = \Carbon\Carbon::parse($d)->format('d/m/Y'); }
        catch (\Throwable $e) { $dateVisite = (string)$d; }
    }
@endphp

<!-- Bandeau top -->
<table class="topbar">
  <tr>
    <td class="logo">
      <img src="{{ public_path('images/wh.png') }}" alt="Logo" style="max-height:36px; border:none;">
    </td>
    <td class="title">
      <div class="title-main">Formulaire</div>
      <div>« Visites Observation et ronde HSE »</div>
    </td>
    <td class="meta">
      <div>Date d’émission<br><strong>{{ $emission }}</strong></div>
    </td>
  </tr>
</table>

<hr class="top-divider">

<!-- Informations -->
<div class="section-bar">Informations</div>
<table class="info-grid">
  <tr>
    <td class="w-33"><strong>Date :</strong> {{ $dateVisite }}</td>
    <td class="w-33"><strong>Projet :</strong> {{ $vod->projet }}</td>
    <td class="w-33"><strong>Activité :</strong> {{ $vod->activite }}</td>
  </tr>
  <tr>
    <td class="w-33"><strong>Observateur :</strong> {{ $vod->observateur }}</td>
    <td class="w-33">
      <strong>Personnes observées :</strong>
      <div class="muted">
        @foreach ($vod->personnes_observees ?? [] as $p)
          • {{ $p }}<br>
        @endforeach
      </div>
    </td>
    <td class="w-33">
      <strong>Entreprise observée :</strong>
      <div class="muted">
        @foreach ($vod->entreprise_observee ?? [] as $e)
          • {{ $e }}<br>
        @endforeach
      </div>
    </td>
  </tr>
</table>

<!-- Bonnes pratiques (horizontal + photo sur toute la largeur) -->
<div class="section-bar">Bonnes pratiques</div>
@if (!empty($vod->pratiques))
  <table class="hlist">
    <tbody>
      @foreach ($vod->pratiques as $p)
        <tr>
          <td class="label">Description</td>
          <td>{{ $p['text'] ?? '' }}</td>
        </tr>
        @if (!empty($p['photo']))
          <tr>
            <td colspan="2">
              <img class="photo-wide" src="{{ public_path('storage/' . $p['photo']) }}" alt="">
            </td>
          </tr>
        @endif
        <!-- petite ligne “espace” entre les items -->
        @if (!$loop->last)
          <tr><td class="spacer" colspan="2" style="border:none; padding:4px 0;"></td></tr>
        @endif
      @endforeach
    </tbody>
  </table>
@else
  <div class="muted">Aucune.</div>
@endif

<!-- Comportements dangereux (horizontal + photo sur toute la largeur) -->
<div class="section-bar">Comportements dangereux</div>
@if (!empty($vod->comportements))
  <table class="hlist">
    <tbody>
      @foreach ($vod->comportements as $c)
        <tr>
          <td class="label">Type</td>
          <td>{{ $c['type'] ?? '' }}</td>
        </tr>
        <tr>
          <td class="label">Description</td>
          <td>{{ $c['description'] ?? '' }}</td>
        </tr>
        @if (!empty($c['photo']))
          <tr>
            <td colspan="2">
              <img class="photo-wide" src="{{ public_path('storage/' . $c['photo']) }}" alt="">
            </td>
          </tr>
        @endif
        @if (!$loop->last)
          <tr><td class="spacer" colspan="2" style="border:none; padding:4px 0;"></td></tr>
        @endif
      @endforeach
    </tbody>
  </table>
@else
  <div class="muted">Aucun.</div>
@endif

<!-- Conditions dangereuses -->
<div class="section-bar">
  Conditions dangereuses
  <br><small>Cocher en cas de détection d'une ou plusieurs anomalies.</small>
</div>
@php $conds = $vod->conditions ?? []; @endphp
@if (!empty($conds))
  <ul>
    @foreach ($conds as $k => $v)
      @if ($v) <li>{{ $k }}</li> @endif
    @endforeach
  </ul>
@else
  <div class="muted">Aucune.</div>
@endif

<!-- Actions correctives -->
<div class="section-bar">Actions correctives</div>
@php $corr = $vod->correctives ?? []; @endphp
@if (!empty($corr))
  @foreach ($corr as $k => $fields)
    <div class="box" style="margin-bottom:8px">
      <strong>{{ $k }}</strong><br>
      @if (!empty($fields['action'])) Action : {{ $fields['action'] }}<br>@endif
      @if (!empty($fields['responsable'])) Responsable : {{ $fields['responsable'] }}<br>@endif
      @if (!empty($fields['statut'])) Statut : {{ $fields['statut'] }}<br>@endif
      @if (!empty($fields['photo']))
        <img src="{{ public_path('storage/' . $fields['photo']) }}" style="max-width:220px; height:auto; max-height:150px;">
      @endif
    </div>
  @endforeach
@else
  <div class="muted">Aucune.</div>
@endif

</body>
</html>
