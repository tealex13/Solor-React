export function shuffleArray(array, seed) {
    let rand = mulberry32(seed)
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function mergeObjects(a, b) {
    return Object.entries(b).reduce((o, [k, v]) => {
        o[k] = v && typeof v === 'object'
            ? mergeObjects(o[k] = o[k] || (Array.isArray(v) ? [] : {}), v)
            : v;
        return o;
    }, a);
}