import { repository } from "@/lib/services/repository";

export async function getInboxData() {
  return {
    conversations: repository.getConversations()
  };
}

export async function getAccountsData() {
  return {
    accounts: repository.getAccounts()
  };
}

export async function getAuditData() {
  return {
    events: repository.getAuditEvents()
  };
}
