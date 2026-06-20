export type DevicePickedContact = {
  name: string;
  mobile: string;
};

type ContactPickerNavigator = Navigator & {
  contacts?: {
    select: (
      properties: Array<'name' | 'tel' | 'email'>,
      options?: { multiple?: boolean },
    ) => Promise<Array<{ name?: string[]; tel?: string[] }>>;
  };
};

function normalizeIndianMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return digits;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return null;
}

function pickName(raw?: string[]): string {
  const candidate = raw?.find((part) => part.trim().length > 0);
  return candidate?.trim() ?? '';
}

function pickMobile(raw?: string[]): string | null {
  if (!raw?.length) {
    return null;
  }
  for (const entry of raw) {
    const normalized = normalizeIndianMobile(entry);
    if (normalized) {
      return normalized;
    }
  }
  return null;
}

export function isContactPickerSupported(): boolean {
  return typeof (navigator as ContactPickerNavigator).contacts?.select === 'function';
}

/** Opens native contact picker when supported; returns null on cancel or unsupported. */
export async function pickDeviceContact(): Promise<DevicePickedContact | null> {
  const contactsApi = (navigator as ContactPickerNavigator).contacts;
  if (!contactsApi?.select) {
    return null;
  }

  try {
    const results = await contactsApi.select(['name', 'tel'], { multiple: false });
    const picked = results[0];
    if (!picked) {
      return null;
    }

    const name = pickName(picked.name);
    const mobile = pickMobile(picked.tel);
    if (!mobile) {
      return null;
    }

    return { name, mobile };
  } catch {
    return null;
  }
}
