import { createAccessControl } from "better-auth/plugins";

const statement = {
    organization: ["update", "delete"],
    member: ["invite", "remove", "updateRole"],
    order: ["view", "updateStatus"],
} as const;

export const ac = createAccessControl(statement);

// Owner: Full access
export const owner = ac.newRole({
    organization: ["update", "delete"],
    member: ["invite", "remove", "updateRole"],
    order: ["view", "updateStatus"],
});

// Manager: can invite member and update member role
export const manager = ac.newRole({
    organization: ["update"],
    member: ["invite", "updateRole"],
    order: ["view", "updateStatus"],
});

// Driver: can only view orders and update order status
export const driver = ac.newRole({
    order: ["view", "updateStatus"],
});

export const user = ac.newRole({})