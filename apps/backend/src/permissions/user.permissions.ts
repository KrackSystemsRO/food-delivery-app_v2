import {
  AbilityBuilder,
  MatchConditions,
  PureAbility,
  AbilityTuple,
} from "@casl/ability";

const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

export default function defineUsersPermissions(role: string) {
  const { can, cannot, build } = new AbilityBuilder<
    PureAbility<AbilityTuple, MatchConditions>
  >(PureAbility);

  switch (role) {
    case "MANAGER":
    case "CLIENT":
    case "COURIER":
    case "ADMIN":
      can(["create", "read", "update", "delete"], "companies");
      can(["create", "read", "update", "delete"], "departments");
      can(["create", "read", "update", "delete", "accept"], "orders");
      can(["create", "read", "update", "delete"], "stores");
      can(["create", "read", "update", "delete"], "products");
      can(["create", "read", "update", "delete"], "users");
      can(["create", "read", "update", "delete"], "cart");
      can(["create", "read", "update", "delete"], "allergens");
      can(["create", "read", "update", "delete"], "categories");
      can(["create", "read", "update", "delete"], "receipes");
      can(["create", "read", "update", "delete"], "ingredients");
      break;
  }

  return build({ conditionsMatcher: lambdaMatcher });
}
