export class User{
	id: number;
	name: string;
	isAdmin: boolean;
	username: string;
	password: string;
	constructor(data: any = {}){
		this.id = data.id ? data.id : undefined;
		this.name = data.name ? data.name : undefined;
		this.isAdmin = data.isAdmin ? data.isAdmin : false;
		this.username = data.username ? data.username : undefined;
		this.password = data.password ? data.password : undefined;
	}
}
