# Image comparison slider for Svelte 3

[![NPM version](https://img.shields.io/npm/v/svelte-image-compare.svg?style=flat)](https://www.npmjs.com/package/svelte-image-compare) [![NPM downloads](https://img.shields.io/npm/dm/svelte-image-compare.svg?style=flat)](https://www.npmjs.com/package/svelte-image-compare)

Simple Svelte component to compare two images using slider.

![preview](https://react-compare-image.yuuniworks.com/anime.gif)

## Features

- Simple
- Responsive (fit to the parent width)
- Size difference between two images handled correctly. Element size determined by following two factors:
  - width of the parent
  - right image's aspect ratio

## Install

```bash
npm i svelte-image-compare --save
```

```bash
yarn add svelte-image-compare
```

CDN: [UNPKG](https://unpkg.com/svelte-image-compare/) | [jsDelivr](https://cdn.jsdelivr.net/npm/svelte-image-compare/) (available as `window.ImageCompare`)

## Usage

```html
<ImageCompare 
    before="//placehold.it/600x200/E8117F/FFFFFF"
    after="//placehold.it/600x200/CCCCCC/FFFFFF"
    contain={true}
>
	<span slot="before">BEFORE</span>
	<span slot="after">AFTER</span>
</ImageCompare>

<script>
    import ImageCompare from './ImageCompare.svelte';
</script>
```

If you are **not** using using es6, instead of importing add 

```html
<script src="/path/to/svelte-image-compare/index.js"></script>
```

just before closing body tag.

## API

## Props

| Name | Type | Description | Required | Default |
| --- | --- | --- | --- | --- |
| `before` | `String` | Path to the image image *before* change | Yes | `empty string` |
| `after` | `String` | Path to the image image *after* change | Yes | `empty string` |
| `offset` | `Number` | How far from the left the slider should be on load (between 0 and 1) | No | `0.5` |
| `contain` | `Boolean` | Determines if images are stretched to fill parent element. Can be used with help of CSS `object-fit: cover` to create full page image comparison | No | `false` |
| `overlay` | `Boolean` | Show overlay upon images | No | `true` |
| `hideOnSlide` | `Boolean` | Hide overlay & labels on sliding | No | `true` |

## Slots

- `before` - element to be placed on top of before image (basically a label)
- `after` - element to be placed on top of after image (basically a label)

## License

MIT &copy; [PaulMaly](https://github.com/PaulMaly)