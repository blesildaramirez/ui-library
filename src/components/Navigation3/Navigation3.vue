<template>
	<PanelMenu
		v-model:expandedKeys="expandedKeys"
		:model="items"
		:pt="navigationStyling"
		class="w-max min-w-60 overflow-y-auto border-e border-s border-light bg-secondary"
		@panel-open="panelOpen"
	></PanelMenu>
</template>

<script setup>
import PanelMenu from 'primevue/panelmenu';
import {ref, reactive} from 'vue';

const props = defineProps({
	links: {
		type: Object,
		required: true,
		validator: (value) => {
			return Object.keys(value).every((key) => 'name' in value[key]);
		},
	},
	ariaLabel: {
		type: String,
		default: 'Site Navigation',
	},
});

// const expandedKeys = ref({});
const items = reactive(convertLinksToArray(props.links));

function convertLinksToArray(links, parent, level = 1) {
	const result = [];

	for (const key in links) {
		const link = links[key];
		const item = {
			label: link.name,
			icon: link.icon,
			link: link.url,
			isCurrent: link.isCurrent,
			key,
			parent,
			level,
		};

		if (link.submenu) {
			item.items = convertLinksToArray(link.submenu, item, level + 1);
			item.expanded = !!item.items?.find(({isCurrent}) => isCurrent);
			// if (item.expanded || link.isCurrent) {
			// 	expandedKeys.value[key] = true;
			// }
		}

		result.push(item);
	}

	return result;
}

function getExpandedKeys(items) {
	const _expandedKeys = {};

	function markExpanded(items) {
		for (const item of items) {
			if (item.isCurrent) {
				_expandedKeys[item.key] = true;
				return true;
			}

			if (item.items && markExpanded(item.items)) {
				_expandedKeys[item.key] = true;
				return true;
			}
		}
		return false;
	}

	markExpanded(items);
	return _expandedKeys;
}

const expandedKeys = ref(getExpandedKeys(items));

const navigationStyling = {
	panelmenu: {
		panel: {
			class: 'mb-1',
		},
		header: {
			class: [
				'rounded-md',
				'outline-none',
				'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50',
			],
		},
		headerContent: ({context, instance}) => {
			var _a, _b;
			return {
				class: [
					// Shape
					'rounded-t-md',
					{
						'rounded-br-md rounded-bl-md':
							!context.active ||
							((_a = instance.activeItem) == null ? void 0 : _a.items) ===
								void 0,
						'rounded-br-0 rounded-bl-0':
							context.active &&
							((_b = instance.activeItem) == null ? void 0 : _b.items) !==
								void 0,
					},
					// Color
					'border border-surface-200 dark:border-surface-700',
					'bg-surface-50 dark:bg-surface-800',
					'text-surface-600 dark:text-surface-0/80',
					{'text-surface-900': context.active},
					// States
					'hover:bg-surface-100 dark:hover:bg-surface-700',
					'hover:text-surface-900',
					// Transition
					'transition duration-200 ease-in-out',
					'transition-shadow duration-200',
				],
			};
		},
		headerLink: {
			class: [
				'relative',
				'font-bold',
				'leading-none',
				'flex items-center',
				'p-5',
				'select-none cursor-pointer no-underline',
			],
		},
		headerLabel: {
			class: 'leading-none',
		},
		headerIcon: {
			class: 'mr-2',
		},
		submenuIcon: {
			class: 'mr-2',
		},
		content: {
			class: [
				'py-2',
				'border border-t-0',
				'rounded-t-none rounded-br-md rounded-bl-md',
				'text-surface-700 dark:text-white/80',
				'bg-surface-0 dark:bg-surface-800',
				'border-surface-200 dark:border-surface-700',
			],
		},
		rootList: {
			class: ['outline-none', 'm-0 p-0 list-none'],
		},
		itemContent: {
			class: [
				'border-none rounded-none',
				'text-surface-700 dark:text-white/80',
				'transition-shadow duration-200',
			],
		},
		itemLink: ({context}) => ({
			class: [
				'relative',
				// Font
				'leading-none',
				// Flex & Alignments
				'flex items-center',
				// Spacing
				'py-3 px-5',
				// Color
				'text-surface-700 dark:text-white/80',
				// States
				'hover:bg-surface-100 dark:hover:bg-surface-700/80 hover:text-surface-700 dark:hover:text-white/80',
				{
					'bg-surface-200 text-surface-700 dark:text-white/80 dark:bg-surface-600/90':
						context.focused,
				},
				// Misc
				'cursor-pointer no-underline',
				'select-none overflow-hidden',
			],
		}),
		itemIcon: {
			class: 'mr-2',
		},
		submenu: {
			class: 'p-0 pl-4 m-0 list-none',
		},
		transition: {
			enterFromClass: 'max-h-0',
			enterActiveClass:
				'overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]',
			enterToClass: 'max-h-[1000px]',
			leaveFromClass: 'max-h-[1000px]',
			leaveActiveClass:
				'overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]',
			leaveToClass: 'max-h-0',
		},
	},
};

function setActiveItem(_items, currentItem) {
	_items.map((item) => {
		// item.isCurrent = currentItem.key === item.key;
		item.isCurrent = currentItem.key === item.key;
		expandedKeys.value[item.key] = currentItem.key === item.key;
	});
}

function panelOpen(event) {
	console.log(event.item);
	expandedKeys.value[event.item.key] = true;
	const item = event.item;
	setActiveItem(items, item);
	// if (item.items?.[0]) {
	// 	setActiveItem(item.items, item.items[0]);
	// }
}
</script>

<style lang="less" scoped>
@import '../../styles/_import';

.nav-section {
	height: calc(100vh - 3rem);
}

.px-8 {
	padding-left: 2rem;
	padding-right: 2rem;
}

.px-9 {
	padding-left: 2.25rem;
	padding-right: 2.25rem;
}

.px-10 {
	padding-left: 2.5rem;
	padding-right: 2.5rem;
}

.px-12 {
	padding-left: 3rem;
	padding-right: 3rem;
}

.px-16 {
	padding-left: 4rem;
	padding-right: 4rem;
}
.px-20 {
	padding-left: 5rem;
	padding-right: 5rem;
}
.px-14 {
	padding-left: 3.5rem;
	padding-right: 3.5rem;
}

.pl-8 {
	padding-left: 2rem;
}

.pl-9 {
	padding-left: 2.25rem;
}

.pl-10 {
	padding-left: 2.5rem;
}

.pl-12 {
	padding-left: 3rem;
}

.pl-16 {
	padding-left: 4rem;
}
.pl-20 {
	padding-left: 5rem;
}
.pl-14 {
	padding-left: 3.5rem;
}
</style>
