import assert from 'node:assert/strict';
import { wedding, eventDate, calendarUrl } from '../app/wedding-config.ts';

assert.equal(eventDate(), null);
assert.equal(calendarUrl(), null);
wedding.time = '10:00';
wedding.timeZone = 'Asia/Jakarta';
wedding.venueName = 'Tempat Uji';
wedding.venueAddress = 'Alamat Uji';
assert.equal(eventDate().toISOString(), '2026-11-14T03:00:00.000Z');
const url = new URL(calendarUrl());
assert.equal(url.hostname, 'calendar.google.com');
assert.equal(url.searchParams.get('dates'), '20261114T030000Z/20261114T050000Z');
assert.equal(url.searchParams.get('location'), 'Tempat Uji, Alamat Uji');
console.log('Wedding date and Calendar URL: PASS');
