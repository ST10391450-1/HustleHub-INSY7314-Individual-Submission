const fs = require('fs/promises');
const path = require('path');
const Gig = require('../models/Gig');


class GigRepository {
    constructor() {
        this.filePath = path.join(__dirname, '../../data/gigs.json');
        this.writeQueue = Promise.resolve();
    }

    async initialise() {
        await fs.mkdir(path.dirname(this.filePath), {
            recursive: true
        });

        try {
            await fs.access(this.filePath);
        } catch {
            await fs.writeFile(this.filePath, '[]', 'utf8');
        }
    }

    async getAll() {
        await this.initialise();

        const content = await fs.readFile(this.filePath, 'utf8');
        const gigs = JSON.parse(content);

        return gigs.map(gig => new Gig(gig));
    }

    async findById(id) {
        const gigs = await this.getAll();
        return gigs.find(gig => gig.id === id) || null;
    }

    async findByFreelancerId(freelancerId) {
        const gigs = await this.getAll();

        return gigs.filter(
            gig => gig.freelancerId === freelancerId
        );
    }

    async create(gigData) {
        const operation = this.writeQueue.then(async () => {
            const gigs = await this.getAll();

            const gig = new Gig(gigData);

            gigs.push(gig);

            await this.saveAll(gigs);

            return gig;
        });

        this.writeQueue = operation.catch(() => {});

        return operation;
    }

    async update(id, updates) {
        const operation = this.writeQueue.then(async () => {
            const gigs = await this.getAll();
            const index = gigs.findIndex(gig => gig.id === id);

            if (index === -1) {
                return null;
            }

            const existingGig = gigs[index];

            const updatedGig = new Gig({
                ...existingGig,
                ...updates,
                id: existingGig.id,
                freelancerId: existingGig.freelancerId,
                createdAt: existingGig.createdAt,
                updatedAt: new Date().toISOString()
            });

            gigs[index] = updatedGig;

            await this.saveAll(gigs);

            return updatedGig;
        });

        this.writeQueue = operation.catch(() => {});

        return operation;
    }

    async delete(id) {
        const operation = this.writeQueue.then(async () => {
            const gigs = await this.getAll();
            const updatedGigs = gigs.filter(gig => gig.id !== id);

            if (updatedGigs.length === gigs.length) {
                return false;
            }

            await this.saveAll(updatedGigs);

            return true;
        });

        this.writeQueue = operation.catch(() => {});

        return operation;
    }

    async saveAll(gigs) {
        const temporaryPath = `${this.filePath}.tmp`;

        await fs.writeFile(
            temporaryPath,
            JSON.stringify(gigs, null, 4),
            'utf8'
        );

        await fs.rename(temporaryPath, this.filePath);
    }
}

module.exports = GigRepository;