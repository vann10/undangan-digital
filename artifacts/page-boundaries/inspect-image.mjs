import sharp from 'sharp';
const input = process.argv[2];
const metadata = await sharp(input).metadata();
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const alphaAt = (x,y) => data[(y * info.width + x) * info.channels + 3];
console.log(JSON.stringify({ metadata, alpha: [alphaAt(0,0), alphaAt(10,10), alphaAt(info.width/2|0,10), alphaAt(info.width/2|0,info.height/2|0)] }));
