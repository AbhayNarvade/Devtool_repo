import { base64Decode } from './tool-content/base64-decode';
import { base64Encode } from './tool-content/base64-encode';
import { csvToJson } from './tool-content/csv-to-json';
import { jsonFormatter } from './tool-content/json-formatter';
import { jsonToCsv } from './tool-content/json-to-csv';
import { jsonToTypescript } from './tool-content/json-to-typescript';
import { jsonToYaml } from './tool-content/json-to-yaml';
import { urlDecode } from './tool-content/url-decode';
import { urlEncode } from './tool-content/url-encode';
import { yamlToJson } from './tool-content/yaml-to-json';
import { chmodCalculator } from './tool-content/chmod-calculator';
import { cronExpressionGenerator } from './tool-content/cron-expression-generator';
import { hashGenerator } from './tool-content/hash-generator';
import { jsonCompare } from './tool-content/json-compare';
import { jwtDecoder } from './tool-content/jwt-decoder';
import { regexTester } from './tool-content/regex-tester';
import { sqlFormatter } from './tool-content/sql-formatter';
import { subnetCalculator } from './tool-content/subnet-calculator';
import { unixTimestampConverter } from './tool-content/unix-timestamp-converter';
import { uuidGenerator } from './tool-content/uuid-generator';
import { compressImage } from './tool-content/compress-image';
import { resizeImage } from './tool-content/resize-image';
import { cropImage } from './tool-content/crop-image';
import { imageConverter } from './tool-content/image-converter';
import { pngToJpg } from './tool-content/png-to-jpg';
import { jpgToPng } from './tool-content/jpg-to-png';
import { pngToWebp } from './tool-content/png-to-webp';
import { webpToPng } from './tool-content/webp-to-png';
import { jpgToWebp } from './tool-content/jpg-to-webp';
import { webpToJpg } from './tool-content/webp-to-jpg';
import type { Tool } from './types';

/**
 * The tool registry: the single source of truth for every tool page, the homepage,
 * category pages, search, related links, the sitemap and structured data.
 *
 * Each entry lives in src/data/tool-content/<slug>.ts. To add a tool, create its entry
 * there, add it to this array, and register its UI in src/tools/registry.tsx (see README).
 * Order here is the display order within each category.
 */
export const tools: Tool[] = [
  // Developer tools
  jsonFormatter,
  jsonToYaml,
  yamlToJson,
  jsonToCsv,
  csvToJson,
  jsonToTypescript,
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  jsonCompare,
  jwtDecoder,
  unixTimestampConverter,
  uuidGenerator,
  hashGenerator,
  regexTester,
  cronExpressionGenerator,
  sqlFormatter,
  chmodCalculator,
  subnetCalculator,
  // Image tools
  compressImage,
  resizeImage,
  cropImage,
  imageConverter,
  pngToJpg,
  jpgToPng,
  pngToWebp,
  webpToPng,
  jpgToWebp,
  webpToJpg,
];
