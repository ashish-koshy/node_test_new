import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CinemaSystem1663877813247 implements MigrationInterface {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I dont want to configure the seating for every show
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'movies',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    await queryRunner.createTable(
      new Table({
        name: 'seats',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          { name: 'price', type: 'integer' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    /** To record every show that happens */
    await queryRunner.createTable(
      new Table({
        name: 'shows',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'movieId', type: 'integer' },
          { name: 'showingAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', },
          { name: 'totalSeatCount', type: 'integer' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'shows',
      new TableForeignKey({
        columnNames: ['movieId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'movies',
        onDelete: 'CASCADE',
      }),
    );
    
    /** To record positions allocated for each type of seat for every show */
    await queryRunner.createTable(
      new Table({
        name: 'seat_positions',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'showId', type: 'integer' },
          { name: 'seatId', type: 'integer' },
          { name: 'seatPositionNo', type: 'integer' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'seat_positions',
      new TableForeignKey({
        columnNames: ['showId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shows',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'seat_positions',
      new TableForeignKey({
        columnNames: ['seatId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'seats',
        onDelete: 'CASCADE',
      }),
    );

    /** To keep track of the number of seats available after every booking for every show */
    await queryRunner.createTable(
      new Table({
        name: 'seat_availability',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'showId', type: 'integer' },
          { name: 'seatId', type: 'integer' },
          { name: 'seatCount', type: 'integer' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'seat_availability',
      new TableForeignKey({
        columnNames: ['showId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shows',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'seat_availability',
      new TableForeignKey({
        columnNames: ['seatId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'seats',
        onDelete: 'CASCADE',
      }),
    );

    /** To record every booking transaction */
    await queryRunner.createTable(
      new Table({
        name: 'bookings',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'showId', type: 'integer' },
          { name: 'customerId', type: 'integer' },
          { name: 'totalPrice', type: 'integer' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['showId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shows',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['customerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'CASCADE',
      }),
    );

    /** To keep track of the seats picked by a customer against a given booking id */
    await queryRunner.createTable(
      new Table({
        name: 'booked_seats',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'bookingId', type: 'integer' },
          { name: 'seatPositionId', type: 'integer' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'booked_seats',
      new TableForeignKey({
        columnNames: ['bookingId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bookings',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'booked_seats',
      new TableForeignKey({
        columnNames: ['seatPositionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'seat_positions',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(`INSERT INTO \`customers\` (\`id\`, \`name\`, \`createdAt\`) VALUES(1, 'Ashish Koshy', '2022-05-27 02:38:54')`);

    await queryRunner.query(`INSERT INTO \`movies\` (\`id\`, \`name\`, \`createdAt\`) VALUES(1, 'Inception', '2022-05-27 02:38:54')`);

    await queryRunner.query(`INSERT INTO \`seats\` (\`id\`, \`name\`, \`price\`, \`createdAt\`) VALUES
      (1, 'General', '10', '2022-05-27 02:38:54'),
      (2, 'Vip', '20', '2022-05-27 02:38:54'),
      (3, 'Couple', '30', '2022-05-27 02:38:54'),
      (4, 'Super Vip', '40', '2022-05-27 02:38:54')`);

    await queryRunner.query(`INSERT INTO \`shows\` (\`id\`, \`movieId\`, \`showingAt\`, \`totalSeatCount\`, \`createdAt\`) VALUES
    (1, 1, '2022-05-27 02:38:54', 50, '2022-05-27 02:38:54')`);

    await queryRunner.query(`INSERT INTO \`seat_positions\` (\`id\`, \`showId\`, \`seatId\`, \`seatPositionNo\`, \`createdAt\`) VALUES
      (1, 1, 1, 40, '2022-05-27 02:38:54'),
      (2, 1, 1, 50, '2022-05-27 02:38:54'),
      (3, 1, 2, 55, '2022-05-27 02:38:54'),
      (4, 1, 3, 60, '2022-05-27 02:38:54'),
      (5, 1, 4, 65, '2022-05-27 02:38:54')`);
    
    await queryRunner.query(`INSERT INTO \`seat_availability\` (\`id\`, \`showId\`, \`seatId\`, \`seatCount\`, \`createdAt\`) VALUES
      (1, 1, 1, 50, '2022-05-27 02:38:54'),
      (2, 1, 2, 50, '2022-05-27 02:38:54'),
      (3, 1, 3, 50, '2022-05-27 02:38:54'),
      (4, 1, 4, 50, '2022-05-27 02:38:54')`);
    
    await queryRunner.query(`INSERT INTO \`bookings\` (\`id\`, \`showId\`, \`customerId\`, \`totalPrice\`, \`createdAt\`) VALUES
      (1, 1, 1, 90, '2022-05-27 02:38:54')`);
    
    await queryRunner.query(`INSERT INTO \`booked_seats\` (\`id\`, \`bookingId\`, \`seatPositionId\`, \`createdAt\`) VALUES
      (1, 1, 1, '2022-05-27 02:38:54'),
      (2, 1, 1, '2022-05-27 02:38:54'),
      (3, 1, 3, '2022-05-27 02:38:54'),
      (4, 1, 4, '2022-05-27 02:38:54')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
