import { prisma } from './prisma';
import { FolderRepository } from '../../domain/repositories/folder.repository';
import { Folder } from '../../domain/entities/folder';

export class PrismaFolderRepository implements FolderRepository {
  async findAllByUserId(userId: number): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
      where: {
        userId,
        parentFolderId: null,
      },
      include: { Subfolders: true },
    });
    return folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentFolderId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      userId: folder.userId,
      children: folder.Subfolders.map(subfolder => ({
        id: subfolder.id,
        name: subfolder.name,
        parentId: subfolder.parentFolderId,
        createdAt: subfolder.createdAt,
        updatedAt: subfolder.updatedAt,
        userId: subfolder.userId,
      })) || [],
    })) as unknown as Folder[];
  }

  async create(name: string, userId: number, parentId?: number): Promise<Folder> {
    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
        parentFolderId: parentId,
      },
    });
    return {
      id: folder.id,
      name: folder.name,
      parentId: folder.parentFolderId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      userId: folder.userId,
    } as Folder;
  }

  async existFolderName(name: string, userId: number, parentId?: number): Promise<boolean> {
    const folder = await prisma.folder.findFirst({
      where: {
        name,
        userId,
        parentFolderId: parentId,
      },
    });
    return !!folder;
  }

  async update(id: number, name: string): Promise<Folder | null> {
    const folder = await prisma.folder.update({
      where: { id },
      data: { name },
    });
    return folder ? {
      id: folder.id,
      name: folder.name,
      parentId: folder.parentFolderId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      userId: folder.userId,
    } as Folder : null;
  }

  async delete(id: number): Promise<void> {
    // mysql Foreign key cascade delete/update exceeds max depth of 15
    // delete all subfolders first
    // get all subfolders deeply use recursive
    const subfolders = await prisma.folder.findMany({
      where: { parentFolderId: id },
      include: { Subfolders: true },
    });
    const subfolderIds = subfolders.map(folder => folder.id);
    for (const subfolder of subfolders) {
      await this.delete(subfolder.id);
    }
    // delete the folder
    await prisma.folder.delete({
      where: { id },
    });
    // delete all subfolders
    await prisma.folder.deleteMany({
      where: { id: { in: subfolderIds } },
    });
  }

  async findById(id: number): Promise<Folder | null> {
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: { Subfolders: true },
    });
    return folder ? {
      id: folder.id,
      name: folder.name,
      parentId: folder.parentFolderId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      userId: folder.userId,
      children: folder.Subfolders.map(subfolder => ({
        id: subfolder.id,
        name: subfolder.name,
        parentId: subfolder.parentFolderId,
        createdAt: subfolder.createdAt,
        updatedAt: subfolder.updatedAt,
        userId: subfolder.userId,
      })) || [],
    } as Folder : null;
  }

  async findAllByParentId(parentId: number): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
      where: { parentFolderId: parentId },
      include: { Subfolders: true },
    });
    return folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentFolderId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      userId: folder.userId,
      children: folder.Subfolders.map(subfolder => ({
        id: subfolder.id,
        name: subfolder.name,
        parentId: subfolder.parentFolderId,
        createdAt: subfolder.createdAt,
        updatedAt: subfolder.updatedAt,
        userId: subfolder.userId,
      })) || [],
    })) as unknown as Folder[];
  }

  async findAllByUserIdAndSearchName(userId: number, name: string): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
      where: {
        userId,
        name: {
          contains: name,
        },
      },
      include: { Subfolders: true },
    });
    return folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentFolderId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      userId: folder.userId,
      children: folder.Subfolders.map(subfolder => ({
        id: subfolder.id,
        name: subfolder.name,
        parentId: subfolder.parentFolderId,
        createdAt: subfolder.createdAt,
        updatedAt: subfolder.updatedAt,
        userId: subfolder.userId,
      })) || [],
    })) as unknown as Folder[];
  }
}
