import { Component } from '@angular/core';
import { User } from '@app/core/models/user.models';

@Component({
    selector: 'app-admin-tab-logic',
    imports: [],
    templateUrl: './admin-tab-logic.html',
    styleUrl: './admin-tab-logic.scss',
})
export class AdminTabLogic {
    generateBoxLeague() {
        const users: Partial<User>[] = [
            { name: 'Alice', username: 'alice123', id: '1' },
            { name: 'Bob', username: 'bob456', id: '2' },
            { name: 'Charlie', username: 'charlie789', id: '3' },
        ];
    }
}
