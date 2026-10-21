#!/usr/bin/env node
/**
 * Verify that the prerendered Netlify Forms markup is present in the static
 * export. Netlify detects forms at deploy time from the built HTML, so a form
 * that exists only after client-side hydration is silently not collected.
 *
 * Read-only. Runs automatically as `postbuild` and can be run with
 * `npm run verify:forms`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist");

/**
 * @type {Array<{
 *   name: string;
 *   file: string;
 *   label: string;
 *   multipart?: boolean;
 *   honeypot?: string;
 *   fileField?: string;
 * }>}
 */
const EXPECTED_FORMS = [
  {
    name: "scroll-submission",
    file: "submit/index.html",
    label: "scroll submission form",
    multipart: true,
    honeypot: "bot-field",
    fileField: "artwork",
  },
  {
    name: "contact",
    file: "contact/index.html",
    label: "contact form",
  },
  {
    name: "sigil-submission",
    file: "submit/sigil/index.html",
    label: "sigil submission form",
    multipart: true,
    honeypot: "bot-field",
    fileField: "image",
  },
];

function formTags(html) {
  return html.match(/<form\b[^>]*>/gi) ?? [];
}

function hasAttribute(tag, name, value) {
  const pattern = new RegExp(
    `\\b${name}\\s*=\\s*"${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
    "i"
  );
  return pattern.test(tag);
}

function inputTags(html) {
  return html.match(/<input\b[^>]*>/gi) ?? [];
}

function hasNamedInput(html, name, value) {
  return inputTags(html).some(
    (tag) => hasAttribute(tag, "name", name) && hasAttribute(tag, "value", value)
  );
}

const failures = [];

if (!existsSync(DIST)) {
  console.error(
    `FAIL verify:forms — ${DIST} does not exist. Run the build first (npm run build).`
  );
  process.exit(1);
}

for (const expected of EXPECTED_FORMS) {
  const path = join(DIST, expected.file);

  if (!existsSync(path)) {
    failures.push(`${expected.label}: built file is missing (${expected.file}).`);
    continue;
  }

  let html;
  try {
    html = readFileSync(path, "utf8");
  } catch (error) {
    failures.push(
      `${expected.label}: could not read ${expected.file} (${error instanceof Error ? error.message : String(error)}).`
    );
    continue;
  }

  const tag = formTags(html).find((candidate) =>
    hasAttribute(candidate, "name", expected.name)
  );

  if (!tag) {
    failures.push(
      `${expected.label}: no <form name="${expected.name}"> found in ${expected.file}.`
    );
    continue;
  }

  if (!hasAttribute(tag, "data-netlify", "true")) {
    failures.push(
      `${expected.label}: <form name="${expected.name}"> is missing data-netlify="true".`
    );
  }

  if (!hasNamedInput(html, "form-name", expected.name)) {
    failures.push(
      `${expected.label}: missing hidden <input name="form-name" value="${expected.name}"> in ${expected.file}.`
    );
  }

  if (expected.multipart && !hasAttribute(tag, "enctype", "multipart/form-data")) {
    failures.push(
      `${expected.label}: <form name="${expected.name}"> is missing enctype="multipart/form-data", so Netlify will not accept the file upload.`
    );
  }

  if (expected.honeypot) {
    if (!hasAttribute(tag, "data-netlify-honeypot", expected.honeypot)) {
      failures.push(
        `${expected.label}: <form name="${expected.name}"> is missing data-netlify-honeypot="${expected.honeypot}".`
      );
    }
    // The honeypot input is rendered with no value attribute; match by name.
    const hasHoneypotField = inputTags(html).some((input) =>
      hasAttribute(input, "name", expected.honeypot)
    );
    if (!hasHoneypotField) {
      failures.push(
        `${expected.label}: missing honeypot <input name="${expected.honeypot}"> in ${expected.file}.`
      );
    }
  }

  if (expected.fileField) {
    // A file input must be present for Netlify to treat the form as an upload
    // form. Match by both type and name so a renamed or retyped field fails.
    const hasFileField = inputTags(html).some(
      (input) =>
        hasAttribute(input, "type", "file") &&
        hasAttribute(input, "name", expected.fileField)
    );
    if (!hasFileField) {
      failures.push(
        `${expected.label}: missing file input <input type="file" name="${expected.fileField}"> in ${expected.file}.`
      );
    }
  }
}

if (failures.length > 0) {
  console.error("FAIL verify:forms — Netlify Forms markup is incomplete:");
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error(
    "Netlify detects forms from the built HTML only. Fix the form markup and rebuild."
  );
  process.exit(1);
}

console.log(
  `PASS verify:forms — ${EXPECTED_FORMS.length} forms detected with required Netlify attributes.`
);
