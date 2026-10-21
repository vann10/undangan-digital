import assert from 'node:assert/strict';
import { wedding, dateLabel, fullDateLabel, timeLabel, eventDate, calendarUrl } from '../app/wedding-config.ts';

assert.equal(dateLabel, '28 November 2026');
assert.equal(fullDateLabel, 'Sabtu, 28 November 2026');
assert.equal(timeLabel, '10.00–13.00 WIB');
assert.equal(eventDate().toISOString(), '2026-11-28T03:00:00.000Z');
const url = new URL(calendarUrl());
assert.equal(url.hostname, 'calendar.google.com');
assert.equal(url.searchParams.get('dates'), '20261128T030000Z/20261128T060000Z');
assert.equal(url.searchParams.get('location'), `${wedding.venueName}, ${wedding.venueAddress}`);
console.log('Wedding date and Calendar URL: PASS');
