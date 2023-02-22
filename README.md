## Abstract

Introducing how to apply `Storybook` for `Tailwindcss` component on `Next.js` framework.

UI Component Documentation 하면 떠오르는 가장 대표적인 도구는 바로 `Storybook` 이다.
이번에 포스팅할 내용은 Utility-first CSS framework인 `Tailwind CSS`를 적용한 `Next.Js` 기반 Storybook 을 작성하는 방법이다.

기존 `Storybook`에 올라온 `Next.Js 12` 적용 방법은 하기의 명령어를 이용해`storybook cli` 기능을 이용해서 프로젝트를 setup 하는 방식이다.
하지만 이 방법은 시간이 오래 걸리는데다 실패율도 높다는 단점이 있다.

```sh
npx sb init --builder webpack5
```

따라서 본 포스팅에서는 기존 프로젝트에 직접 `Storybook`을 적용하는 방법을 소개하고자 한다.

기존 방법은 하기 관련 링크를 참조:
https://storybook.js.org/blog/get-started-with-storybook-and-next-js/

---

## Getting Started

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=Storybook&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=Tailwind CSS&logoColor=white"/>
  <img src="https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=Sass&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=TypeScript&logoColor=white"/>
  <img src="https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white"/>
</p>

### Setting up Next.js Application

원하는 프로젝트를 폴더에 `Next.Js TypeScript` + `Tailwind CSS` 프로젝트 생성

##### Terminal

```sh
# Next.Js 프로젝트 생성
pnpm create next-app . --typescript

# Tailwind CSS 설치
pnpm add -D tailwindcss postcss autoprefixer

pnpm dlx tailwindcss init -p
```

##### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [],
};
```

##### styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

`Tailwind CSS`을 이용한 버튼 컴포넌트 `Button.tsx`을 생성

##### components/Button.tsx

```tsx
import type { FC } from 'react';

interface ButtonProps {
	name: string;
	className: string;
}

const Button: FC<ButtonProps> = ({ name, className }) => {
	return (
		<button className={`p-2 rounded-lg shadow-lg hover:shadow font-bold ${className}`}>
			{name}
		</button>
	);
};

export default Button;
```

---

`index.tsx` 다음과 같이 작성

##### pages/index.tsx

```tsx
import type { NextPage } from 'next';
import Button from '../components/Button';

const Home: NextPage = () => {
	return (
		<main className='w-[100vw] h-[100vh] flex justify-center items-center'>
			<div className='text-center'>
				<header className='mb-5'>
					<h1 className='text-4xl font-bold text-pink-500'>Storybook</h1>
					<h3 className='text-sm text-gray-400'>Next.JS, Tailwind CSS</h3>
				</header>
				<Button name={'Hello Tailwind CSS'} className={'bg-teal-400 text-white'} />
			</div>
		</main>
	);
};

export default Home;
```

---

`Storybook` 관련 패키지 설치

##### Terminal

```sh
# Storybook Core
pnpm add -D @storybook/addon-actions @storybook/addon-essentials @storybook/addon-links @storybook/builder-webpack5 @storybook/manager-webpack5 @storybook/react

# Storybook Addons
pnpm add -D @storybook/preset-scss css-loader sass sass-loader style-loader postcss-loader

# For Next.JS Public Serve
pnpm add -D serve
```

---

### Setting up Storybook for Next.js

`.storybook` 폴더 생성 후 `main.js`, `preview.js` 생성

> #### Note
>
> - 따로 dedicated한 폴더를 만들어 관리하지 않고 직접 컴포넌트 폴더에서 `[filename].stories.ts` 방식으로 관리할 예정이기에 다음과 같이 적용 범위 설정
>
> ```ts
> stories: [
> 		'../components/**/*.stories.@(js|jsx|ts|tsx)',
> 		'../pages/**/*.stories.@(js|jsx|ts|tsx)',
> 	],
> ```
>
> - 필수 요소를 제외한 addon 들은 `Sass` 관련, `Next.Js 12` 관련 addon

##### .storybook/main.js

```js
module.exports = {
	stories: [
		'../components/**/*.stories.@(js|jsx|ts|tsx)',
		'../pages/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-actions',
		'@storybook/addon-essentials',
		{
			name: '@storybook/preset-scss',
			options: {
				cssLoaderOptions: {
					modules: { localIdentName: '[name]__[local]--[hash:base64:5]' },
				},
			},
		},
		'storybook-addon-next',
	],
	framework: '@storybook/react',
	core: {
		builder: 'webpack5',
	},
};
```

##### .storybook/preview.js

```js
import '../styles/globals.css';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};
```

---

`tsconfig.json` 에 `baseUrl` 추가

##### tsconfig.json

```json
{
	"compilerOptions": {
	    ...
		"baseUrl": "."
        ...
	},
    ...
}
```

---

`package.json` 에 `script` 추가

##### package.json

```json
{
	...
	"scripts": {
		...
		"storybook:dev": "start-storybook -p 6006 -s public",
		"storybook:prod": "serve storybook-static",
		"storybook:build": "build-storybook -s public"
	},
	...
}
```

---

`components` 폴더에 `Button.tsx` 대응하는 `Button.stories.tsx` 생성

##### components/Button.stories.tsx

```tsx
import Button from './Button';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
	title: 'Button',
	component: Button,
	argTypes: {
		name: {
			control: 'text',
		},
		className: {
			control: 'text',
		},
	},
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {
	name: 'Hello Tailwind CSS',
	className: 'bg-teal-400 text-white',
};
```

---

`storybook` 구동 후 `Storybook Dashboard` 확인

##### Terminal

```sh
pnpm storybook:dev
```

---

## Result

### 👉 [CodeSandBox Sample Link](https://codesandbox.io/p/github/soom-kang/How-to-set-up-Storybook-for-Tailwind-CSS-Next.Js-12/main?workspaceId=99d1ebdb-6029-4fa4-945c-b71e7dfc3e5d&file=%2FREADME.md&workspace=%257B%2522activeFileId%2522%253A%2522clefw2qdt000fg1k53uar5hsn%2522%252C%2522openFiles%2522%253A%255B%2522%252FREADME.md%2522%255D%252C%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522gitSidebarPanel%2522%253A%2522COMMIT%2522%252C%2522spaces%2522%253A%257B%2522clefw2t5w00153b6le78rugwi%2522%253A%257B%2522key%2522%253A%2522clefw2t5w00153b6le78rugwi%2522%252C%2522name%2522%253A%2522Default%2522%252C%2522devtools%2522%253A%255B%257B%2522type%2522%253A%2522PREVIEW%2522%252C%2522taskId%2522%253A%2522dev%2522%252C%2522port%2522%253A3000%252C%2522key%2522%253A%2522clefw3mz5008k3b6lafjgk2e1%2522%252C%2522isMinimized%2522%253Afalse%257D%252C%257B%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522dev%2522%252C%2522key%2522%253A%2522clefw3lyg00633b6l5zrit0cl%2522%252C%2522isMinimized%2522%253Afalse%257D%255D%257D%257D%252C%2522currentSpace%2522%253A%2522clefw2t5w00153b6le78rugwi%2522%252C%2522spacesOrder%2522%253A%255B%2522clefw2t5w00153b6le78rugwi%2522%255D%252C%2522hideCodeEditor%2522%253Afalse%257D)

![result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4zhznitbfjfwqdd6lm3a.png)
![sb result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vcdowa5bwqj5exfjnjcl.png)

---

## Conclusion

본 포스팅에서는 `Next.Js 12` 를 기준으로 `Tailwind CSS` 와 함께 `StoryBook`을 적용하는 방법을 알아보았다.
현재 기준 (2022/08) `StoryBook`이 `Next.Js 12`에 다소 안정화되지 않은 모습이 아쉽지만 Component 별로 UI Documentation 기능을 제공하는 `StoryBook` 자체의 장점만으로도 충분히 매력적인 선택지라고 생각한다.

`StoryBook`에는 위에 언급된 addon 외 에도 `Tailwind CSS` 다크 모드를 지원하는 `Tailwind dark mode`를 포함한 다양한 addon을 지원하고 있다.

하기 링크에서 더 많은 addon을 확인할 수 있다.
SB Addons Link: https://storybook.js.org/addons/
