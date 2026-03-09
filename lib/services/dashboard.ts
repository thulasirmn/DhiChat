import { repository } from "@/lib/services/repository";

export async function getInboxData(userId: string) {
  return {
    conversations: await repository.getConversations(userId)
  };
}

export async function getAccountsData(userId: string) {
  return {
    accounts: await repository.getAccounts(userId)
  };
}

export async function getAuditData(userId: string) {
  return {
    events: await repository.getAuditEvents(userId)
  };
}
