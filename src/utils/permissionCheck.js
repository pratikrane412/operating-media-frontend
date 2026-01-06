export const hasPermission = (requiredPerm) => {
  const adminData = localStorage.getItem("admin");
  if (!adminData) return false;

  const user = JSON.parse(adminData);

  // 1. THE SUPER ADMIN BYPASS
  // If the user email is exactly the super admin email, or the role is super_admin,
  // they pass every check automatically.
  if (user.email === "admin@ims247.com" || user.role === "super_admin") {
    return true;
  }

  // 2. STAFF RESTRICTED ACCESS
  // If not the super admin, check the permission string from the 'users' table
  if (!user.role_perms) return false;

  const userPerms = user.role_perms
    .toLowerCase()
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p !== "");

  // Special case: check for a global 'all' keyword in staff perms if applicable
  if (userPerms.includes("all")) return true;

  // Final check: Is the specific required permission in the user's list?
  return userPerms.includes(requiredPerm.toLowerCase());
};
