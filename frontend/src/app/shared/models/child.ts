interface Child {
  id: string;
  firstName: string;
  lastName: number;
  group: string;
}

interface ChildDuplicate {
  firstName: string;
  lastName: number;
}

interface ImportChild {
  importedCount: number;
  duplicates: ChildDuplicate[];
}

export type { Child, ImportChild };
