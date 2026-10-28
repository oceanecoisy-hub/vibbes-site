(function(){
  var URL_API = 'https://zbnaaojyjcjmvmjlfzxj.supabase.co/rest/v1/waitlist';
  var CLE = 'sb_publishable_1Sm2UEc9yiUNTpySz3bk9Q_ih0WUXVy';
  var f = document.getElementById('f'), b = document.getElementById('b'), m = document.getElementById('m');
  var e = document.getElementById('email'), v = document.getElementById('ville'), piege = document.getElementById('site');
  var ouvertLe = Date.now(), envois = 0;
  var source = '';
  try { source = (new URLSearchParams(location.search).get('src') || '').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40); } catch(_){}

  function dire(txt, ok){ m.textContent = txt; m.className = 'msg ' + (ok ? 'ok' : 'err'); }
  var OK = 'C’est noté. On te prévient dès que Vibbes est dispo.';

  f.addEventListener('submit', function(ev){
    ev.preventDefault();
    // Robots : champ piège rempli ou formulaire envoyé en moins de 2 secondes
    if ((piege && piege.value) || Date.now() - ouvertLe < 2000) { dire(OK, true); f.reset(); return; }
    if (envois >= 5) { dire('Tu as déjà envoyé plusieurs inscriptions. Recharge la page pour réessayer.', false); return; }
    var email = e.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) { dire('Cet e-mail ne semble pas valide. Vérifie-le et réessaie.', false); e.focus(); return; }
    envois++;
    b.disabled = true; b.textContent = 'Envoi…';
    fetch(URL_API, {
      method: 'POST',
      headers: { 'apikey': CLE, 'Authorization': 'Bearer ' + CLE, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ email: email, ville: v.value.trim().slice(0,80) || null, source: source || null })
    }).then(function(r){
      if (r.ok) { dire(OK, true); f.reset(); }
      else if (r.status === 409) { dire('Tu es déjà sur la liste. On te prévient au lancement.', true); }
      else if (r.status === 400) { dire('Beaucoup de monde en même temps. Réessaie dans une minute.', false); }
      else { dire('L’inscription n’a pas marché. Réessaie dans un instant.', false); }
    }).catch(function(){
      dire('Pas de connexion. Vérifie ton réseau et réessaie.', false);
    }).then(function(){ b.disabled = false; b.textContent = 'Préviens-moi'; });
  });
})();
