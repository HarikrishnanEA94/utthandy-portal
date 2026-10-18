// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://harikrishnanea94.github.io',
	base: '/utthandy-portal',
	integrations: [
		starlight({
			title: 'Utthandy',
			description: 'Free, hands-on cybersecurity training for IT and OT/ICS.',
			logo: { src: './src/assets/logo.svg', alt: 'Utthandy' },
			favicon: '/favicon.svg',
			customCss: ['./src/styles/theme.css'],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/HarikrishnanEA94/utthandy-portal' },
			],
			editLink: {
				baseUrl: 'https://github.com/HarikrishnanEA94/utthandy-portal/edit/main/',
			},
			lastUpdated: true,
			sidebar: [
				{ label: 'Start here', items: [{ label: 'Welcome', slug: 'start' }] },
				{ label: 'IT Security', items: [{ autogenerate: { directory: 'it' } }] },
				{ label: 'OT / ICS Security', items: [{ autogenerate: { directory: 'ot' } }] },
				{
					label: 'About',
					items: [
						{ label: 'About Utthandy', slug: 'about' },
						{ label: 'Ethics & legal', slug: 'legal' },
					],
				},
			],
		}),
	],
});
