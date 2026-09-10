/**
 * AI RESCUEFLOW SHADOW — Internal Video Library Adapter
 * Replaces manifest.csv workflow completely with the internal video library.
 */
import { INTERNAL_VIDEOS } from './videoLibrary.js';

export { INTERNAL_VIDEOS };
export const MANIFEST_VIDEOS = INTERNAL_VIDEOS;
export const VIDEO_STATE_GROUPS = [];
