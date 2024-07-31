<template>
	<div class="flex gap-x-4 gap-y-4 flex-col sm:flex-row">
		<UButton to="/dashboard/user/data-user" variant="outline">
			<UIcon name="i-material-symbols-manage-accounts-rounded" class="text-primary text-2xl" />
			User
		</UButton>
		<UButton to="/dashboard/user/data-penjaga" variant="outline">
			<UIcon name="i-material-symbols-manage-accounts-rounded" class="text-primary text-2xl" />
			Penjaga
		</UButton>
	</div>
</template>
