import { OrderInfoType } from "@/types/OrderType";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateOrgSlug(name: string, userId: string): string {
    if (!name) {
        return `org-${userId.slice(0, 8)}`;
    }

    // Convert to lowercase
    let slug = name.toLowerCase();

    // Replace spaces and special characters with hyphens
    slug = slug.replace(/[^a-z0-9]+/g, "-");

    // Remove leading and trailing hyphens
    slug = slug.replace(/^-+|-+$/g, "");

    // Append a unique identifier (first 8 characters of userId)
    slug += `-${userId.slice(0, 8)}`;

    return slug;
}

//generate OTP verfication
export function generateOTP(length = 6) {
    const digits = '0123456789';
    let OTP = '';

    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * digits.length)];
    }

    return OTP;
}

// ==========================================
// function which make the first letter of the string capital
// ==========================================
export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================
// parse the search params
// ==========================================
export function decodeSearchParams<T = Record<string, string | string[] | undefined>>(
    searchParams: Record<string, string | string[] | undefined>
): T {
    const decodedParams: Record<string, string | string[]> = {};

    // Iterate through the keys of the plain object and assign values to the decodedParams
    for (const key in searchParams) {
        if (searchParams[key] !== undefined) {
            decodedParams[key] = searchParams[key] as string | string[];
        }
    }

    return decodedParams as T;
}

export function convertToLocalTime(timeString: string) {
    if (!timeString) return ""; // Handle empty values

    // Handle 2-hour interval format: "2025-02-20 14:00"
    if (timeString.match(/^\d{1,2}(\.\d{2})?-\d{1,2}(\.\d{2})?$/)) {
        const [start, end] = timeString.split("-").map((t) => parseFloat(t));

        const formatHour = (hour: number) => {
            const period = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 === 0 ? 12 : hour % 12;
            return `${hour12}${period}`;
        };
        return `${formatHour(start)} - ${formatHour(end)}`;
    }

    // Handle day format: "2025-02-20"
    else if (timeString.match(/^\d{4}-\d{2}-\d{1,2}$/)) {
        const date = new Date(timeString + " UTC");
        return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
    }

    // Handle month format: "2025-02"
    else if (timeString.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = timeString.split("-");
        const date = new Date(`${year}-${month}-01 UTC`);
        return date.toLocaleDateString([], { year: "numeric", month: "short" });
    }

    // Handle year format: "2025"
    else if (timeString.match(/^\d{4}$/)) {
        return timeString; // Year remains unchanged
    }

    return timeString; // Fallback for unexpected formats
}

/**
 * Function which will compare two array of `string | number` to check if both are same or not.
 * @param {Array<number | string>} a Array One
 * @param {Array<number | string>} b Array 2nd
 * @returns {boolean} `true` if both are same otherwise `false`
 */
export function isSameArray(a: Array<string | number>, b: Array<string | number>): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
}

/**
 * Extracts a cookie value from a raw `Set-Cookie` header string.
 *
 * @param cookiesHeader - The full Set-Cookie header string (may include multiple cookies).
 * @param key - The name of the cookie you want to extract.
 * @returns The cookie value if found, otherwise undefined.
 */
export function getCookieValue(cookiesHeader: Headers, key: string): string | undefined {
    // Split by comma to handle multiple cookies in one header
    const rawCookies = cookiesHeader.get('Set-Cookie')?.split(",") || [];

    for (const rawCookie of rawCookies) {
        const parts = rawCookie.trim().split(";");
        const [cookieKey, cookieValue] = parts[0].split("=", 2);

        if (cookieKey === key) {
            return cookieValue;
        }
    }

    return undefined;
}

export function normalizeShopifyResponse(data: any): OrderInfoType | null {
    if (!data) return null;

    const {
        id,
        total_price,
        payment_gateway_names,
        shipping_address,
        billing_address,
    } = data;

    // prefer shipping address, fallback to billing address
    const address = shipping_address || billing_address || {};

    return {
        order_id: id,
        name: address.name || '',
        address: address.address1 || '',
        city: address.city || '',
        country: address.country || '',
        phone: address.phone || '',
        amount: total_price || '',
        payment: payment_gateway_names?.[0] || undefined,
        country_code: address.country_code || '',
        latitude: address.latitude || undefined,
        longitude: address.longitude || undefined,
        date_created_gmt: data.created_at || null,
        date_modified_gmt: data.updated_at || null
    };
}
