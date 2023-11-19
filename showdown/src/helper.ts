import { input, select, confirm } from '@inquirer/prompts';

export const promptUserInput = async ({ question }: { question: string }): Promise<string> => {
  const answer = await input({ message: question });
  return answer;
};

export const promptSelect = async ({
  question,
  choices,
  pageSize,
}: {
  question: string;
  choices: { value: string; name: string }[];
  pageSize?: number;
}): Promise<string> => {
  const answer = await select({
    message: question,
    choices,
    pageSize,
  });

  // choice.value is the answer
  return answer;
};

export const promptConfirm = async ({ question }: { question: string }): Promise<boolean> => {
  const answer = await confirm({ message: question });
  return answer;
};
