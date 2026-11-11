import { TICKER } from '../data/profile';

export function Ticker() {
  const row = TICKER.map((t, i) => (
    <div className="tick" key={i}>
      <span className="k">{t.k}</span>
      <span className="v">{t.v}</span>
      {t.up && <span className="up">▲</span>}
    </div>
  ));
  return (
    <div className="ticker" role="marquee" aria-label="Highlights">
      <div className="ticker-track">
        {row}
        <div style={{ display: 'contents' }} aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  );
}
