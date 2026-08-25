import { createAccessControl } from "better-auth/plugins";

const statement = {
    organization: ["update", "delete"],
    invitation: ['create', 'cancel'],
    member: ["invite", "delete", "update"],
    order: ["view", "updateStatus"],
} as const;

export const ac = createAccessControl(statement);

// Owner: Full access
export const owner = ac.newRole({
    organization: ["update", "delete"],
    invitation: ['create', 'cancel'],
    member: ["invite", "delete", "update"],
    order: ["view", "updateStatus"],
});

// Manager: can invite member and update member role
export const manager = ac.newRole({
    organization: ["update"],
    invitation: ["create"],
    member: ["invite", "update"],
    order: ["view", "updateStatus"],
});

// Driver: can only view orders and update order status
export const driver = ac.newRole({
    order: ["view", "updateStatus"],
});
