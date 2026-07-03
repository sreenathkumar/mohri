import dbConnect from "@/dbConnect";
import Memberships from "@/models/membershipModel";
import User from "@/models/userModel";

export async function fetchDrivers({ merchantId }: { merchantId: string }) {
    //connect to the database
    await dbConnect();

    //query the database for all drivers
    const members = await Memberships.find({ role: 'driver', merchant: merchantId }).populate('user', 'name image email');

    //return the drivers
    if (members && members.length > 0) {
        const transformedmembers = members.map((member) => {
            return {
                id: member.user._id?.toString() || member.user.email,
                name: member.user.name,
                image: member.user.image,
            }
        });

        return transformedmembers;
    } else {
        return [];
    }
}


interface MutateEmployeeData {
    name: string;
    email: string;
    role: 'clerk' | 'driver' | 'merchant';
}

export async function mutateEmployee({ id, data }: { id: string, data: MutateEmployeeData }) {
    await dbConnect();
    const { role, name, email } = data;

    if (name || email) {
        await User.findByIdAndUpdate(id, { name, email });
    }

    if (role) {
        await Memberships.findOneAndUpdate({ user: id }, { role });
    }
}

