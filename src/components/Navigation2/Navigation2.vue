<template>
	<PanelMenu
		v-model:expandedKeys="expandedKeys"
		:model="items"
		:pt="navigationStyling"
		class="w-max min-w-60 overflow-y-auto border-e border-s border-light bg-secondary"
		@panel-open="panelOpen"
	>
		<template #item="{item, active, hasSubmenu}">
			<PkpButton
				element="a"
				:href="item.link"
				:is-active="item.isCurrent"
				:icon="item.icon"
				:class="[
					item.level === 2 ? 'px-9' : '',
					item.level === 3 ? 'px-12' : '',
					item.level === 4 ? 'px-14' : '',
				]"
				size-variant="fullWidth"
				class="mt-1 border-b border-light"
				@click="handleClick(item, item.parent)"
			>
				{{ item.label }}
				<Icon
					v-if="hasSubmenu"
					class="ml-auto h-4 w-4"
					:icon="active ? 'caret-up' : 'Dropdown'"
				/>
			</PkpButton>
		</template>
	</PanelMenu>
</template>

<script setup>
import PanelMenu from 'primevue/panelmenu';
import PkpButton from '../Button/Button.vue';
import Icon from '../Icon/Icon.vue';
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
		header: () => {
			return {
				attrs: ['tabindex=null'],
			};
		},
		headerContent: () => {
			return {
				class: [
					// Transition
					'transition duration-200 ease-in-out',
					'transition-shadow duration-200',
				],
			};
		},
		content: {
			class: [
				'border-none rounded-none',
				'text-surface-700 dark:text-white/80',
				'transition-shadow duration-200',
			],
		},
		itemContent: {
			class: ['transition-shadow duration-200'],
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

function handleClick(item, parent) {
	// if (!parent) return;
	// setActiveItem(parent.items, item);
	// setActiveItem(items, {});
	// if (item.level > 2) {
	// 	item.parent.isCurrent = false;
	// }
	// console.log(item);
	// console.log(parent);
}

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
