export const hasPermission = (requiredPerm) => {
  const adminData = localStorage.getItem("admin");
  if (!adminData) return false;

  const user = JSON.parse(adminData);

  // 1. Super Admin bypass (from the 'admin' table)
  if (user.role === "super_admin") return true;

  // 2. Staff check (from the 'users' table 'perm' column)
  // We split the string "add batch,view student" into an array
  const userPerms = user.role_perms ? user.role_perms.toLowerCase().split(",").map(p => p.trim()) : [];

  // Return true if the required permission is in their list
  return userPerms.includes(requiredPerm.toLowerCase());
};