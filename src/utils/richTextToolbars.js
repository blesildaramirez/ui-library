/**
 * Standardized TinyMCE toolbar presets ("Sets") for rich-text fields.
 *
 * These mirror the PHP constants on
 * PKP\components\forms\FieldRichTextarea (TOOLBAR_FULL, TOOLBAR_STANDARD,
 * TOOLBAR_BASIC, TOOLBAR_MINIMAL) so the toolbar for a given field is defined
 * in one place per system instead of being duplicated as an inline string.
 *
 * Fields that need an extra, field-specific button (e.g. pkpInsert,
 * pkpAttachFiles) should append it to one of these, e.g.
 * `${TOOLBAR_MINIMAL} | pkpInsert`.
 */
export const TOOLBAR_FULL =
	'blocks | bold italic underline | superscript subscript | link unlink | blockquote bullist numlist | image | code';

export const TOOLBAR_STANDARD =
	'bold italic underline | superscript subscript | link unlink | blockquote bullist numlist | image | code';

export const TOOLBAR_BASIC =
	'bold italic underline | superscript subscript | link unlink | blockquote bullist numlist | image';

export const TOOLBAR_MINIMAL =
	'bold italic underline | superscript subscript | link unlink | blockquote bullist numlist';
