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
