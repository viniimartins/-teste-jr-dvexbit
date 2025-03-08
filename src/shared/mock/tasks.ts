import { ITask } from '@/app/(panel)/types'

const mock: ITask = {
  id: crypto.randomUUID(),
  description: 'Teste',
  name: 'Teste',
  status: 'DONE',
  createdAt: new Date().toISOString(),
}

const content = Array.from({ length: 8 }, (_, index) => ({
  ...mock,
  id: mock.id + index,
}))

export const TaskMock = content
