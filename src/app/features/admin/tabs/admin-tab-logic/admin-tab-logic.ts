import { Component } from '@angular/core';
import { User } from '@app/core/models/user.models';

/**
 *
 */
@Component({
    selector: 'app-admin-tab-logic',
    imports: [],
    templateUrl: './admin-tab-logic.html',
    styleUrl: './admin-tab-logic.scss',
})
export class AdminTabLogic {
    /**
     *
     */
    generateBoxLeague(): void {
        const users: Partial<User>[] = [
            { name: 'Alice', username: 'alice123', documentId: '1' },
            { name: 'Bob', username: 'bob456', documentId: '2' },
            { name: 'Charlie', username: 'charlie789', documentId: '3' },
        ];
        console.log('Generating box league with users:', users);
    }
}
