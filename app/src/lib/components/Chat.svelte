<script>
	import Eliza from 'elizabot';
	import { beforeUpdate, afterUpdate } from 'svelte';
	import axios from 'axios';
	import {serverEndpoint} from '../../configurations'

	let div;
	let autoscroll;
	let userPrompt;
	let APIKey = '';

	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

	const eliza = new Eliza();

	let comments = [{ author: 'eliza', text: eliza.getInitial() }];

	async function handleSubmitChat(event) {
		if (!userPrompt || !APIKey) {
			return;
		}
		comments = comments.concat({
			author: 'user',
			text: userPrompt
		});
		let response = await makeAPICall(userPrompt);
		let reply = response.data.reply.choices[0].text;
		// update chat ui
		comments = comments
			.filter((comment) => !comment.placeholder)
			.concat({
				author: 'eliza',
				text: reply
			});
		
		userPrompt = ''
	}

	async function makeAPICall(userPrompt) {
		return await axios.post(serverEndpoint, {
			api: APIKey,
			message: userPrompt
		});
	}

	function getChatReply(text) {
		if (!text) return;

		comments = comments.concat({
			author: 'user',
			text
		});

		const reply = eliza.transform(text);

		setTimeout(() => {
			comments = comments.concat({
				author: 'eliza',
				text: '...',
				placeholder: true
			});

			setTimeout(() => {
				comments = comments
					.filter((comment) => !comment.placeholder)
					.concat({
						author: 'eliza',
						text: reply
					});
			}, 500 + Math.random() * 500);
		}, 200 + Math.random() * 200);
	}

</script>

<div class="chat direct-chat card-body flex flex-col">
	<div class="flex flex-row">
		<h3 class="text-xl font-bold text-gray-three">Enter your API Key here:</h3>
		<input bind:value={APIKey} />
	</div>
	<!-- <div class="flex flex-row">
		<h3 class="text-xl font-bold text-gray-three">Enter your Server Endpoint:</h3>
		<input bind:value={serverEndpoint} />
	</div> -->

	<div class="text-xl font-bold text-gray-three">Chat Messages</div>
	<div class="card-body " bind:this={div}>
		<div class="direct-chat-messages">
			{#each comments as comment}
				<article class={comment.author}>
					<span>{comment.text}</span>
				</article>
			{/each}
		</div>
	</div>

	Input
	<form class="flex flex-row justify-center" on:submit={handleSubmitChat}>
		<input
			class="flex w-full items-center justify-between rounded-md border-2 border-gray-one px-5 py-1"
			bind:value={userPrompt}
		/>
		<button
			class="flex items-center rounded-md border-cream-four bg-green-one px-6 py-1 text-lg font-semibold text-gray-five outline outline-2 outline-offset-2 outline-green-one hover:text-green-five focus-visible:text-green-five focus-visible:outline-green-five"
			type="submit"
		>
			enter
		</button>
	</form>
</div>

<style>
	.direct-chat .card-body {
		overflow-x: hidden;
		padding: 0;
		position: relative;
	}
	.direct-chat-messages {
		-webkit-transform: translate(0, 0);
		transform: translate(0, 0);
		height: 400px;
		overflow: auto;
		padding: 10px;
		transition: -webkit-transform 0.5s ease-in-out;
		transition: transform 0.5s ease-in-out;
		transition: transform 0.5s ease-in-out, -webkit-transform 0.5s ease-in-out;
	}
	.chat {
		display: flex;
		flex-direction: column;
		height: 100%;
		/* max-width: ; */
	}

	.scrollable {
		flex: 1 1 auto;
		border-top: 1px solid #eee;
		margin: 0 0 0.5em 0;
		overflow-y: auto;
	}

	article {
		margin: 0.5em 0;
	}

	.user {
		text-align: right;
	}

	span {
		padding: 0.5em 1em;
		display: inline-block;
	}

	.eliza span {
		background-color: #eee;
		border-radius: 1em 1em 1em 0;
	}

	.user span {
		background-color: #0074d9;
		color: white;
		border-radius: 1em 1em 0 1em;
		word-break: break-all;
	}
</style>
