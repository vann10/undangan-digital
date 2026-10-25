// Single source for the Opening → Hero motion system. Times are seconds.
export const transitionConfig = {
  colors: { tealDeep: '#174a4a', tealMid: '#2f6b6b', sage: '#6b8f7a', cream: '#faf7f1', sand: '#e7dcc6', gold: '#c9a96b', heroText: '#174a4a', guestText: '#000000', venuePaper: '#f2eee3', rsvpPaper: '#f7f1e5' },
  opacity: { secondary: .8, paper: .10, ripple: .45, fog: .6, shadow: .12, water: .28, backVine: .62, particles: .82, sky: .22, idleParticles: .45, guestGlass: .05, guestBorder: .22 },
  duration: { total: 3.8, reduced: .6, button: .5, gates: 1.05, butterfly: 1.2, exit: .7, landscape: 2.3, arch: .9, photo: .85, bouquet: .65, branches: 1.2, shared: 1.6, date: .6, audio: 1.5, bridge: 1, idleSway: 6, idleFog: 10, idleFade: 1.5 },
  at: { button: 0, gates: .15, butterfly: .2, exit: .3, landscape: .9, arch: 1.1, photo: 1.55, bouquet: 1.7, branches: 1.4, shared: 1.6, date: 2.4, bridge: 2.2, settle: 3.2 },
  ease: { gates: 'power3.inOut', reveal: 'power2.out', arch: 'power2.inOut', bloom: 'back.out(1.6)', spring: 'back.out(2)' },
  stagger: { segments: .05, text: .08, bouquet: .06, leaves: .04, date: .1 },
  particles: { count: 32, lowCount: 18, idleCount: 4, maxDpr: 2, fpsThreshold: 45, start: .2, end: 2.8, seed: 141126, petalWeights: [.6,.25,.05], leafWeights: [.7,.3] },
  motion: { vineExit: 45, frontScale: 1.12, backScale: 1.06, landscapeY: 0, landscapeScale: 1.2, nameScale: .91, wingMin: .35, wingDuration: .13, idleSway: 1.4, fogStart: -8, fogEnd: 8 },
  layout: { nameHeight: 6.4, nameShift: 12.09, dividerHeight: 1.9, dividerShift: 14.59, heroOffset: 0 },
  audio: { src: '/audio/reverie-scott-buckley.mp3', volume: .6 },
};

export function transitionVariables() {
  const vars = {};
  for (const [key, value] of Object.entries(transitionConfig.colors)) vars[`--${key.replace(/[A-Z]/g, c => '-'+c.toLowerCase())}`] = value;
  for (const [key, value] of Object.entries(transitionConfig.opacity)) vars[`--opacity-${key}`] = String(value);
  vars['--shadow-color'] = `rgba(23,74,74,${transitionConfig.opacity.shadow})`;
  vars['--hero-offset'] = `${transitionConfig.layout.heroOffset}px`;
  vars['--name-height'] = `${transitionConfig.layout.nameHeight}%`;
  vars['--divider-height'] = `${transitionConfig.layout.dividerHeight}%`;
  return vars;
}
