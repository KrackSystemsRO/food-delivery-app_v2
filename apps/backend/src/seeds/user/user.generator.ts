import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "@/models/user.model";
import companyModel from "@/models/company.model";
import storeModel from "@/models/store.model";
import departmentModel from "@/models/department.model";

const companies = [
  {
    name: "Provider",
    email: "suport.online@provider.com",
    type: "PROVIDER",
    address: "Strada principală nr.1",
    phone_number: "0720511263",
    is_active: true,
  },
  {
    name: "McDonald's Romanina",
    email: "mc.romania@client.com",
    type: "CLIENT",
    address: "Strada principală nr.1",
    phone_number: "0720511254",
    is_active: true,
  },
  {
    name: "FRY Romanina",
    email: "fry.romania@client.com",
    type: "CLIENT",
    address: "Strada principală nr.1",
    phone_number: "0720511254",
    is_active: true,
  },
  {
    name: "Kaufland Romania",
    email: "kaufland.romania@client.com",
    type: "CLIENT",
    address: "Strada principală nr.1",
    phone_number: "0720511254",
    is_active: true,
  },
  {
    name: "Lidl Romania",
    email: "lidl.romania@client.com",
    type: "CLIENT",
    address: "Strada principală nr.1",
    phone_number: "0720511254",
    is_active: true,
  },
  {
    name: "Cafeneaua Nației",
    email: "cafeneaua.natiei.romania@client.com",
    type: "CLIENT",
    address: "Strada principală nr.1",
    phone_number: "0720511254",
    is_active: true,
  },
];

const roles = ["ADMIN", "MANAGER", "EMPLOYEE", "CLIENT", "COURIER"];

const stores = {
  "McDonald's Romanina": [
    {
      name: "MC #120",
      address: "Strada 1, Nr. 120",
      type: "RESTAURANT",
      phone_number: "+40720123120",
      description: "Main McDonald's restaurant at Strada 1",
      location: { lat: 46.770439, lng: 23.591423 },
    },
    {
      name: "MC #121",
      address: "Strada 1, Nr. 121",
      type: "RESTAURANT",
      phone_number: "+40720123121",
      description: "Second McDonald's restaurant at Strada 1",
      location: { lat: 46.771, lng: 23.592 },
    },
  ],
  "FRY Romanina": [
    {
      name: "FRY #120",
      address: "Strada 2, Nr. 120",
      type: "RESTAURANT",
      phone_number: "+40720123122",
      description: "FRY Restaurant near Strada 2",
      location: { lat: 46.772, lng: 23.593 },
    },
    {
      name: "FRY #121",
      address: "Strada 2, Nr. 121",
      type: "RESTAURANT",
      phone_number: "+40720123123",
      description: "FRY Restaurant second location",
      location: { lat: 46.7725, lng: 23.5935 },
    },
  ],
  "Kaufland Romania": [
    {
      name: "KF #120",
      address: "Bulevardul Central 3",
      type: "GROCERY",
      phone_number: "+40720123124",
      description: "Kaufland grocery store central location 3",
      location: { lat: 46.773, lng: 23.594 },
    },
    {
      name: "KF #121",
      address: "Bulevardul Central 4",
      type: "GROCERY",
      phone_number: "+40720123125",
      description: "Kaufland grocery store central location 4",
      location: { lat: 46.7735, lng: 23.5945 },
    },
  ],
  "Lidl Romania": [
    {
      name: "LI #120",
      address: "Calea Victoriei 10",
      type: "GROCERY",
      phone_number: "+40720123126",
      description: "Lidl grocery store on Calea Victoriei",
      location: { lat: 46.774, lng: 23.595 },
    },
    {
      name: "LI #121",
      address: "Calea Victoriei 11",
      type: "GROCERY",
      phone_number: "+40720123127",
      description: "Lidl grocery store second location",
      location: { lat: 46.7745, lng: 23.5955 },
    },
  ],
  "Cafeneaua Nației": [
    {
      name: "CN #120",
      address: "Piața Unirii 5",
      type: "CAFE",
      phone_number: "+40720123128",
      description: "Cafeneaua Nației cafe near Piața Unirii",
      location: { lat: 46.775, lng: 23.596 },
    },
    {
      name: "CN #121",
      address: "Piața Unirii 6",
      type: "CAFE",
      phone_number: "+40720123129",
      description: "Second Cafeneaua Nației location",
      location: { lat: 46.7755, lng: 23.5965 },
    },
  ],
  Provider: [],
};

function generatePhoneNumber(base, role) {
  const baseNum = base.replace(/\D/g, "");
  const roleCode =
    role.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 1000;
  return "0" + (parseInt(baseNum.slice(-8)) + roleCode).toString().slice(-8);
}

function pickDepartment(role) {
  if (role === "ADMIN") return "Head Office";
  if (role === "MANAGER") return "Sales";
  if (role === "EMPLOYEE") return "Kitchen";
  if (role === "CLIENT") return null;
  if (role === "COURIER") return "Delivery";
  return null;
}

function pickStores(role, companyName) {
  if (role === "MANAGER" || role === "COURIER") {
    return stores[companyName] || [];
  }
  return [];
}

const users = [];

companies.forEach((company) => {
  roles.forEach((role) => {
    const user = {
      first_name:
        role === "ADMIN"
          ? "Admin"
          : role.charAt(0) + role.slice(1).toLowerCase(),
      last_name: company.name.replace(/\s/g, ""),
      email: `${role.toLowerCase()}@${company.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")}.com`,
      password: "test1234",
      role: role,
      phone_number: generatePhoneNumber(company.phone_number, role),
      company: company.name,
      department: pickDepartment(role),
      stores: pickStores(role, company.name),
      isCompanyAdmin: role === "ADMIN",
      isDepartmentAdmin: role === "ADMIN" || role === "MANAGER",
      isStoreAdmin: role === "MANAGER" || role === "MANAGER_RESTAURANT",
    };

    users.push(user);
  });
});

async function getOrCreateCompany(companyData) {
  let company = await companyModel.findOne({ name: companyData.name });
  if (!company) {
    company = await companyModel.create(companyData);
  }
  return company;
}

async function getOrCreateDepartment(name, companyId) {
  if (!name) return null;
  let department = await departmentModel.findOne({ name, company: companyId });
  if (!department) {
    department = await departmentModel.create({ name, company: companyId });
  }
  return department;
}

async function getOrCreateStore(storeData, companyId) {
  if (!storeData || !storeData.name) return null;

  let store = await storeModel.findOne({
    name: storeData.name,
    company: companyId,
  });

  if (!store) {
    store = await storeModel.create({
      name: storeData.name,
      address: storeData.address,
      type: storeData.type,
      company: companyId,
      phone_number: storeData.phone_number || null,
      description: storeData.description || "",
      location: storeData.location || { lat: null, lng: null },
    });
  }
  return store;
}

export async function insertUsers() {
  try {
    for (const companyData of companies) {
      const company = await getOrCreateCompany(companyData);

      for (const role of roles) {
        const departmentName = pickDepartment(role);
        const storesNames = pickStores(role, company.name);

        const department = await getOrCreateDepartment(
          departmentName,
          company._id
        );

        const stores = [];
        for (const storeData of storesNames) {
          const store = await getOrCreateStore(storeData, company._id);
          if (store) stores.push(store._id);
        }

        const email = `${role.toLowerCase()}@${company.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")}.com`;

        const exists = await userModel.findOne({ email });
        if (exists) {
          console.log(`Skipping existing user: ${email}`);
          continue;
        }

        const hashedPassword = await bcrypt.hash("test", 10);

        const userData = {
          first_name:
            role === "ADMIN"
              ? "Admin"
              : role.charAt(0) + role.slice(1).toLowerCase(),
          last_name: company.name.replace(/\s/g, ""),
          email,
          password: hashedPassword,
          role,
          phone_number: generatePhoneNumber(company.phone_number, role),
          company: company._id,
          department: department ? department._id : null,
          stores,
          isCompanyAdmin: role === "ADMIN",
          isDepartmentAdmin: role === "ADMIN" || role === "MANAGER",
          isStoreAdmin: role === "MANAGER",
        };

        const user = await userModel.create(userData);

        if (role === "ADMIN") {
          const companyToUpdate = await companyModel.findById(user.company);
          if (companyToUpdate) {
            companyToUpdate.admin = companyToUpdate.admin || [];
            if (!companyToUpdate.admin.includes(user._id)) {
              companyToUpdate.admin.push(user._id);
              await companyToUpdate.save();
            }
          }
        }

        if ((role === "ADMIN" || role === "MANAGER") && user.department) {
          const departmentToUpdate = await departmentModel.findById(
            user.department
          );
          if (departmentToUpdate) {
            departmentToUpdate.admin = departmentToUpdate.admin || [];
            if (!departmentToUpdate.admin.includes(user._id)) {
              departmentToUpdate.admin.push(user._id);
              await departmentToUpdate.save();
            }
          }
        }

        if (role === "MANAGER" && user.stores && user.stores.length > 0) {
          for (const storeId of user.stores) {
            const store = await storeModel.findById(storeId);
            if (
              store.type === "RESTAURANT" ||
              (role === "MANAGER" && store.type === "GROCERY")
            ) {
              const storeToUpdate = await storeModel.findById(storeId);
              if (storeToUpdate) {
                storeToUpdate.admin = storeToUpdate.admin || [];
                if (!storeToUpdate.admin.includes(user._id)) {
                  storeToUpdate.admin.push(user._id);
                  await storeToUpdate.save();
                }
              }
            }
          }
        }

        console.log(`Created user: ${email}`);
      }
    }

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}
