<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>VOD #{{ $vod->id }}</title>
  <style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color:#111; }
    .muted { color:#666; }
    .box { border:1px solid #ddd; padding:10px; border-radius:6px; margin-bottom:6px; }

    table { width:100%; border-collapse: collapse; margin-bottom:12px; }
    th, td { border:1px solid #eee; padding:6px; text-align:left; vertical-align: top; }

    .photo-wide { width:100%; height:auto; max-height:320px; }

    .topbar { width:100%; color:#fff; background:#0a2a5a; border:1px solid #0a2a5a; }
    .topbar td { border:1px solid #0a2a5a; padding:10px 12px; }
    .topbar .title { text-align:center; font-weight:bold; }
    .title-main { font-size:16px; }

    .section-bar { background:#000; color:#fff; text-align:center; font-weight:bold; padding:6px 10px; margin:18px 0 8px; }
    .section-bar small { font-weight:normal; font-style:italic; }
  </style>
</head>
<body>
@php
    $emission = $vod->created_at
        ? \Carbon\Carbon::parse($vod->created_at)->format('d/m/Y')
        : now()->format('d/m/Y');

    $dateVisite = '—';
    $d = $vod->getAttribute('date');
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
    <td><strong>VOD Contractant</strong></td>
    <td class="title">
      <div class="title-main">Formulaire « Visites Observation et ronde HSE »</div>
    </td>
    <td style="text-align:right;">
      Date d’émission<br><strong>{{ $emission }}</strong>
    </td>
  </tr>
</table>

<!-- Informations -->
<div class="section-bar">Informations</div>
<table>
  <tr>
    <td><strong>Date :</strong> {{ $dateVisite }}</td>
    <td><strong>Projet :</strong> {{ $vod->projet }}</td>
    <td><strong>Activité :</strong> {{ $vod->activite }}</td>
  </tr>
  <tr>
    <td><strong>Observateur :</strong> {{ $vod->observateur }}</td>
    <td colspan="2">
      <strong>Entreprise :</strong>
      {{ optional($vod->contractor)->company_name ?? '—' }}
    </td>
  </tr>
</table>

<!-- Bonnes pratiques -->
<div class="section-bar">Bonnes pratiques</div>
@if (!empty($vod->pratiques))
  <table>
    @foreach ($vod->pratiques as $p)
      <tr>
        <td><strong>Description</strong></td>
        <td>{{ $p['text'] ?? '' }}</td>
      </tr>
      @if (!empty($p['photo']))
        <tr>
          <td colspan="2">
            <img class="photo-wide" src="{{ public_path('storage/' . $p['photo']) }}" alt="">
          </td>
        </tr>
      @endif
    @endforeach
  </table>
@else
  <div class="muted">Aucune.</div>
@endif

<!-- Comportements dangereux -->
<div class="section-bar">Comportements dangereux</div>
@if (!empty($vod->comportements))
  <table>
    @foreach ($vod->comportements as $c)
      <tr>
        <td><strong>Type</strong></td>
        <td>{{ $c['type'] ?? '' }}</td>
      </tr>
      <tr>
        <td><strong>Description</strong></td>
        <td>{{ $c['description'] ?? '' }}</td>
      </tr>
      @if (!empty($c['photo']))
        <tr>
          <td colspan="2">
            <img class="photo-wide" src="{{ public_path('storage/' . $c['photo']) }}" alt="">
          </td>
        </tr>
      @endif
    @endforeach
  </table>
@else
  <div class="muted">Aucun.</div>
@endif

<!-- Conditions dangereuses -->
<div class="section-bar">
  Conditions dangereuses
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
    <div class="box">
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
